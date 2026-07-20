'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/use-app-store';
import { CATEGORIES } from '@/lib/constants';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import HeroSection from '@/components/landing/hero-section';
import StatsSection from '@/components/landing/stats-section';
import CategoriesSection from '@/components/landing/categories-section';
import FeaturedSection from '@/components/landing/featured-section';
import HowItWorksSection from '@/components/landing/how-it-works-section';
import CtaSection from '@/components/landing/cta-section';
import CustomerSupportSection from '@/components/landing/customer-support-section';
import ProjectFilters from '@/components/projects/project-filters';
import ProjectGrid from '@/components/projects/project-grid';
import ProjectDetail from '@/components/projects/project-detail';
import ProjectForm from '@/components/projects/project-form';
import UserDashboard from '@/components/dashboard/user-dashboard';
import StorefrontPreview from '@/components/storefront/storefront-preview';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const {
    currentView, setCategories,
    searchFilters, projects, setProjects, setLoading, isLoading,
  } = useAppStore();

  // Load categories with real project counts from DB
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const apiCategories = await res.json();
          // Merge API categories (with counts) with static categories (for icons/names)
          const merged = CATEGORIES.map((c) => {
            const apiCat = apiCategories.find((ac: any) => ac.slug === c.slug);
            return {
              ...c,
              _count: apiCat?._count || { projects: 0 },
            };
          });
          setCategories(merged);
        } else {
          // Fallback to static
          setCategories(CATEGORIES.map(c => ({ ...c, _count: { projects: 0 } })));
        }
      } catch {
        setCategories(CATEGORIES.map(c => ({ ...c, _count: { projects: 0 } })));
      }
    }
    loadCategories();
  }, [setCategories]);

  // Fetch projects when on browse view or filters change
  useEffect(() => {
    if (currentView !== 'browse') return;
    async function fetchProjects() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchFilters.query) params.set('query', searchFilters.query);
        if (searchFilters.category) params.set('category', searchFilters.category);
        if (searchFilters.country) params.set('country', searchFilters.country);
        if (searchFilters.priceMin) params.set('priceMin', String(searchFilters.priceMin));
        if (searchFilters.priceMax) params.set('priceMax', String(searchFilters.priceMax));
        if (searchFilters.revenueMin) params.set('revenueMin', String(searchFilters.revenueMin));
        if (searchFilters.revenueMax) params.set('revenueMax', String(searchFilters.revenueMax));
        if (searchFilters.roiMin) params.set('roiMin', String(searchFilters.roiMin));
        if (searchFilters.businessStage) params.set('businessStage', searchFilters.businessStage);
        if (searchFilters.sortBy) params.set('sortBy', searchFilters.sortBy);
        if (searchFilters.page) params.set('page', String(searchFilters.page));
        if (searchFilters.limit) params.set('limit', String(searchFilters.limit));

        const res = await fetch(`/api/projects?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || []);
        }
      } catch (e) {
        console.error('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [currentView, searchFilters, setProjects, setLoading]);

  const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.15 } },
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <>
            <HeroSection />
            <StatsSection />
            <CategoriesSection />
            <FeaturedSection />
            <HowItWorksSection />
            <CtaSection />
            <CustomerSupportSection />
          </>
        );
      case 'browse':
        return (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <ProjectFilters />
              <div className="flex-1 min-w-0">
                <ProjectGrid projects={projects} isLoading={isLoading} />
              </div>
            </div>
          </div>
        );
      case 'detail':
        return <ProjectDetail />;
      case 'create':
        return (
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
            <ProjectForm />
          </div>
        );
      case 'dashboard':
        return (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <UserDashboard />
          </div>
        );
      case 'storefront':
        return <StorefrontPreview />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {currentView !== 'storefront' && <Header />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={currentView === 'storefront' ? '' : 'min-h-[calc(100vh-4rem)]'}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      {currentView !== 'storefront' && <Footer />}
    </div>
  );
}