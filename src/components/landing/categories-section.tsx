'use client';

import { motion } from 'framer-motion';
import { CATEGORIES, CATEGORY_ICONS } from '@/lib/constants';
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
    <section className="f5-light-section py-16 sm:py-20">
      {/* Decorative gradient blob — top-right */}
      <div className="f5-light-blob" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="f5-section-heading">Browse by Category</h2>
          <p className="mt-3 text-[#A0A0B0] sm:text-lg">
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
                <div
                  className="bg-[#F3F4F6] rounded-2xl p-5 group cursor-pointer text-center hover:bg-[#4F46E5]/5 hover:border-[#4F46E5]/20 transition-all duration-300 border border-transparent hover:shadow-md"
                  onClick={() => handleCategoryClick(cat.slug)}
                >
                  <div className="flex flex-col items-center gap-2.5">
                    <div
                      className="flex items-center justify-center rounded-xl"
                      style={{ width: 44, height: 44, backgroundColor: 'rgba(79, 70, 229, 0.1)' }}
                    >
                      {Icon && <Icon className="size-5 text-[#4F46E5]" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#0D0C22]">
                        {cat.name}
                      </p>
                      <p className="text-xs text-[#A0A0B0]">
                        {cat._count?.projects ?? '—'} projects
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
