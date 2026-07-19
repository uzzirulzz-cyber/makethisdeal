import { create } from 'zustand';
import type { ViewType, SearchFilters, Project, User, Category } from '@/lib/types';

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

export const useAppStore = create<AppState>((set) => ({
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
}));