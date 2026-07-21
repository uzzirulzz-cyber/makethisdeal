import { create } from 'zustand';
import type { ViewType, SearchFilters, Project, User, Category, CartItem } from '@/lib/types';
import type { CurrencyMode } from '@/lib/currency';
import { detectRegion } from '@/lib/currency';

interface AppState {
  currentView: ViewType;
  previousView: ViewType;
  selectedProjectId: string | null;
  setCurrentView: (view: ViewType) => void;
  goToProject: (projectId: string) => void;
  goBack: () => void;

  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  projects: Project[];
  setProjects: (projects: Project[]) => void;
  featuredProjects: Project[];
  setFeaturedProjects: (projects: Project[]) => void;

  categories: Category[];
  setCategories: (categories: Category[]) => void;

  searchFilters: SearchFilters;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;

  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Currency
  currencyMode: CurrencyMode;
  setCurrencyMode: (mode: CurrencyMode) => void;
  toggleCurrency: () => void;
  pkrToUsd: number;
  setExchangeRate: (pkrToUsd: number) => void;

  // Cart
  cartItems: CartItem[];
  cartTotalPkr: number;
  cartLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (projectId: string, pricePkr: number, priceType: string) => Promise<boolean>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => void;

  // Admin
  isAdminAuthenticated: boolean;
  setAdminAuthenticated: (auth: boolean) => void;
}

const defaultFilters: SearchFilters = {
  query: '',
  category: '',
  country: '',
  priceMin: undefined,
  priceMax: undefined,
  revenueMin: undefined,
  revenueMax: undefined,
  roiMin: undefined,
  businessStage: '',
  sortBy: 'newest',
  page: 1,
  limit: 12,
};

function getCartSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = localStorage.getItem('mtd_cart_session');
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('mtd_cart_session', sid);
  }
  return sid;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentView: 'landing',
  previousView: 'landing',
  selectedProjectId: null,
  setCurrentView: (view) => set((state) => ({ currentView: view, previousView: state.currentView })),
  goToProject: (projectId) => set((state) => ({
    previousView: state.currentView,
    currentView: 'detail',
    selectedProjectId: projectId,
  })),
  goBack: () => set((state) => ({
    currentView: state.previousView,
    previousView: 'landing',
  })),

  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  projects: [],
  setProjects: (projects) => set({ projects }),
  featuredProjects: [],
  setFeaturedProjects: (projects) => set({ featuredProjects: projects }),

  categories: [],
  setCategories: (categories) => set({ categories }),

  searchFilters: defaultFilters,
  setSearchFilters: (filters) => set((state) => ({
    searchFilters: { ...state.searchFilters, ...filters },
  })),
  resetFilters: () => set({ searchFilters: defaultFilters }),

  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // Currency - auto-detect region
  currencyMode: detectRegion(),
  setCurrencyMode: (mode) => set({ currencyMode: mode }),
  toggleCurrency: () => set((state) => ({
    currencyMode: state.currencyMode === 'PKR' ? 'USD' : 'PKR',
  })),
  pkrToUsd: 1 / 278,
  setExchangeRate: (pkrToUsd) => set({ pkrToUsd }),

  // Cart
  cartItems: [],
  cartTotalPkr: 0,
  cartLoading: false,
  fetchCart: async () => {
    const sessionId = getCartSessionId();
    if (!sessionId) return;
    set({ cartLoading: true });
    try {
      const res = await fetch(`/api/cart?sessionId=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        const items = data.items || [];
        const total = items.reduce((sum: number, item: CartItem) => sum + item.pricePkr, 0);
        set({ cartItems: items, cartTotalPkr: total });
      }
    } catch {
      // silent
    } finally {
      set({ cartLoading: false });
    }
  },
  addToCart: async (projectId: string, pricePkr: number, priceType: string) => {
    const sessionId = getCartSessionId();
    if (!sessionId) return false;
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, projectId, pricePkr, priceType }),
      });
      if (res.ok) {
        await get().fetchCart();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  removeFromCart: async (cartItemId: string) => {
    try {
      await fetch(`/api/cart?itemId=${cartItemId}`, { method: 'DELETE' });
      await get().fetchCart();
    } catch {
      // silent
    }
  },
  clearCart: () => set({ cartItems: [], cartTotalPkr: 0 }),

  // Admin
  isAdminAuthenticated: false,
  setAdminAuthenticated: (auth) => set({ isAdminAuthenticated: auth }),
}));
