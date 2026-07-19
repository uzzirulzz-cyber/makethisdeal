'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/use-app-store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  Menu, X, Search, Plus, LayoutDashboard, Heart,
  ArrowRight, ChevronDown, User, LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { currentView, setCurrentView, currentUser, setCurrentUser, searchFilters, setSearchFilters } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => setScrolled(window.scrollY > 10));
  }

  const navItems = [
    { label: 'Browse Projects', view: 'browse' as const, icon: Search },
    { label: 'List a Project', view: 'create' as const, icon: Plus },
    { label: 'Dashboard', view: 'dashboard' as const, icon: LayoutDashboard },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-border/50 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm transition-transform group-hover:scale-105">
              MTD
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-tight">
                Make<span className="text-primary">This</span>Deal
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.view}
                variant={currentView === item.view ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView(item.view)}
                className={`gap-2 font-medium ${
                  currentView === item.view ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search bar on browse */}
            {currentView === 'browse' && (
              <div className="hidden lg:flex items-center relative">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchFilters.query}
                  onChange={(e) => setSearchFilters({ query: e.target.value, page: 1 })}
                  className="h-9 w-64 rounded-lg border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative gap-2"
                  onClick={() => setCurrentView('dashboard')}
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Favorites</span>
                </Button>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{currentUser.name.split(' ')[0]}</span>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
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
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  <button
                    onClick={() => { setCurrentView('landing'); setMobileOpen(false); }}
                    className="flex items-center gap-2.5"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      MTD
                    </div>
                    <span className="text-lg font-bold">MakeThisDeal</span>
                  </button>
                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Button
                        key={item.view}
                        variant={currentView === item.view ? 'secondary' : 'ghost'}
                        className="justify-start gap-3 h-12"
                        onClick={() => { setCurrentView(item.view); setMobileOpen(false); }}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    ))}
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