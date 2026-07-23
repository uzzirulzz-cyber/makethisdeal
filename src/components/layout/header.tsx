'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/use-app-store';
import { useCurrency } from '@/hooks/use-currency';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import Image from 'next/image';
import {
  Menu, Search, Plus, LayoutDashboard, Heart, LogIn, Repeat, ShoppingCart, Shield
} from 'lucide-react';

export function Header() {
  const { currentView, setCurrentView, currentUser, setCurrentUser, searchFilters, setSearchFilters, toggleCurrency, cartItems, fetchCart } = useAppStore();
  const { mode, symbol, rateDisplay } = useCurrency();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => setScrolled(window.scrollY > 10));
  }

  const navItems = [
    { label: 'Browse Projects', view: 'browse' as const, icon: Search },
    { label: 'List a Project', view: 'create' as const, icon: Plus },
    { label: 'Shopping Cart', view: 'cart' as const, icon: ShoppingCart },
    { label: 'Dashboard', view: 'dashboard' as const, icon: LayoutDashboard },
    { label: 'Admin', view: 'admin' as const, icon: Shield },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'f5-glass' : 'f5-navbar'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 group"
          >
            <Image
              src="/logo-mtd.png"
              alt="MakeThisDeal Logo"
              width={36}
              height={36}
              className="object-contain transition-transform group-hover:scale-105"
              priority
            />
            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-tight text-[#0D0C22]">
                Make<span className="text-[#4F46E5]">This</span>Deal
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <Button
                  key={item.view}
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView(item.view)}
                  className="gap-2 font-medium transition-all duration-200 rounded-full"
                  style={{
                    backgroundColor: isActive ? '#0D0C22' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#6E6E80',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = '#0D0C22';
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(13, 12, 34, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = '#6E6E80';
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Currency Toggle */}
            <button
              onClick={toggleCurrency}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: 'rgba(79, 70, 229, 0.08)',
                color: '#4F46E5',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(79, 70, 229, 0.15)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(79, 70, 229, 0.08)';
              }}
              title={rateDisplay}
            >
              <Repeat className="size-3" />
              <span>{symbol}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setCurrentView('cart')}
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: currentView === 'cart' ? 'rgba(79, 70, 229, 0.15)' : 'rgba(79, 70, 229, 0.08)',
                color: '#4F46E5',
              }}
              title="Shopping Cart"
            >
              <ShoppingCart className="size-4" />
              {cartItems.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                  style={{ backgroundColor: '#4F46E5' }}
                >
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* Search bar on browse */}
            {currentView === 'browse' && (
              <div className="hidden lg:flex items-center relative">
                <Search className="absolute left-3 h-4 w-4 text-[#A0A0B0]" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchFilters.query}
                  onChange={(e) => setSearchFilters({ query: e.target.value, page: 1 })}
                  className="h-9 w-64 rounded-full pl-9 pr-4 text-sm transition-all focus:outline-none focus:ring-2"
                  style={{
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#F3F4F6',
                    color: '#0D0C22',
                    // @ts-expect-error CSS custom property
                    '--tw-ring-color': 'rgba(79, 70, 229, 0.2)',
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = '#4F46E5';
                    (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.15)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = '#E5E7EB';
                    (e.target as HTMLInputElement).style.boxShadow = 'none';
                  }}
                />
              </div>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative gap-2 transition-colors"
                  style={{ color: '#6E6E80' }}
                  onClick={() => setCurrentView('dashboard')}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#4F46E5';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#6E6E80';
                  }}
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Favorites</span>
                </Button>
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5' }}
                >
                  <div
                    className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: '#4F46E5' }}
                  >
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{currentUser.name.split(' ')[0]}</span>
                </div>
              </div>
            ) : (
              <button
                className="f5-btn-primary flex items-center gap-2 !py-2 !px-4 text-sm"
                onClick={() => setCurrentUser({
                  id: 'demo_user',
                  email: 'demo@makethisdeal.com',
                  name: 'Demo User',
                  role: 'seller',
                  company: 'Demo Corp',
                  country: 'United States',
                  verified: false,
                  createdAt: new Date().toISOString(),
                })}
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  style={{ color: '#0D0C22' }}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80"
                style={{ backgroundColor: '#FFFFFF', borderLeft: '1px solid #E5E7EB' }}
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  <button
                    onClick={() => { setCurrentView('landing'); setMobileOpen(false); }}
                    className="flex items-center gap-2.5"
                  >
                    <Image
                      src="/logo-mtd.png"
                      alt="MakeThisDeal Logo"
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                    <span className="text-lg font-bold text-[#0D0C22]">
                      Make<span className="text-[#4F46E5]">This</span>Deal
                    </span>
                  </button>
                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                      const isActive = currentView === item.view;
                      return (
                        <button
                          key={item.view}
                          className="flex items-center gap-3 h-12 px-3 rounded-full text-sm font-medium transition-all duration-200"
                          style={{
                            backgroundColor: isActive ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                            color: isActive ? '#4F46E5' : '#6E6E80',
                          }}
                          onClick={() => { setCurrentView(item.view); setMobileOpen(false); }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(79, 70, 229, 0.06)';
                              (e.currentTarget as HTMLElement).style.color = '#4F46E5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                              (e.currentTarget as HTMLElement).style.color = '#6E6E80';
                            }
                          }}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
