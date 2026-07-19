'use client';

import { motion } from 'framer-motion';
import { CATEGORIES, CATEGORY_ICONS } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/use-app-store';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function CategoriesSection() {
  const { categories, setCurrentView, setSearchFilters } = useAppStore();

  // Merge static categories with API counts
  const displayCategories = CATEGORIES.map((cat) => {
    const apiCat = categories.find((c) => c.slug === cat.slug);
    return {
      ...cat,
      _count: apiCat?._count || { projects: 0 },
    };
  });

  const handleCategoryClick = (slug: string) => {
    setSearchFilters({ category: slug, page: 1 });
    setCurrentView('browse');
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-3 text-muted-foreground sm:text-lg">
            Explore projects across every industry
          </p>
        </div>

        {/* Category Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
        >
          {displayCategories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon || ''] || null;
            return (
              <motion.div key={cat.id} variants={cardVariants}>
                <Card
                  className="group cursor-pointer border-0 bg-secondary/30 py-4 shadow-none transition-all hover:bg-primary/5 hover:shadow-md"
                  onClick={() => handleCategoryClick(cat.slug)}
                >
                  <CardContent className="flex flex-col items-center gap-2.5 p-3 text-center">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                      {Icon && <Icon className="size-5 text-primary" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {cat.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {cat._count?.projects ?? '—'} projects
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}