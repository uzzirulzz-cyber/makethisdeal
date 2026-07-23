'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, BadgeCheck, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/use-app-store';
import { useCurrency } from '@/hooks/use-currency';
import { CATEGORY_ICONS, getCategoryName, getCategoryIconKey } from '@/lib/constants';
import type { Project } from '@/lib/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const GRADIENTS = [
  'from-[#4F46E5]/10 to-[#EC4899]/10',
  'from-[#6366F1]/10 to-[#4F46E5]/10',
  'from-[#4F46E5]/10 to-[#EC4899]/10',
  'from-[#EC4899]/10 to-[#F472B6]/10',
  'from-[#6366F1]/10 to-[#4F46E5]/10',
  'from-[#4F46E5]/10 to-[#6366F1]/10',
];

function renderCategoryIcon(categorySlug: string, className: string) {
  const iconKey = getCategoryIconKey(categorySlug);
  const IconComponent = CATEGORY_ICONS[iconKey];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
}

function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

function FeaturedProjectCard({ project, index }: { project: Project; index: number }) {
  const goToProject = useAppStore((s) => s.goToProject);
  const { formatPrice } = useCurrency();
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <motion.div variants={cardVariants}>
      <div
        className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm group cursor-pointer overflow-hidden hover:border-[#4F46E5]/30 hover:shadow-md transition-all duration-300"
        onClick={() => goToProject(project.id)}
      >
        {/* Thumbnail placeholder */}
        <div
          className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${gradient}`}
        >
          {renderCategoryIcon(project.category, 'size-12 text-[#4F46E5]/40 transition-transform group-hover:scale-110')}
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 bg-[#F3F4F6] text-xs rounded-full px-3 py-1 font-medium text-[#6E6E80] backdrop-blur-sm border-0"
          >
            {getCategoryName(project.category)}
          </Badge>
          {project.featured && (
            <Badge className="absolute right-3 top-3 gap-1 border-0 bg-[#F59E0B] text-xs rounded-full px-3 py-1 text-white">
              <Star className="size-3" />
              Featured
            </Badge>
          )}
          {project.status === 'active' && !project.featured && (
            <Badge className="absolute right-3 top-3 border-0 bg-[#10B981] text-xs rounded-full px-3 py-1 text-white">
              Active
            </Badge>
          )}
        </div>

        <div className="p-5">
          {/* Project Name */}
          <h3 className="truncate text-base font-semibold leading-snug text-[#0D0C22] transition-colors group-hover:text-[#4F46E5]">
            {project.name}
          </h3>

          {/* Country */}
          {project.country && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-[#A0A0B0]">
              <MapPin className="size-3" />
              <span>{project.country}</span>
            </div>
          )}

          {/* Key Metrics */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span className="font-bold text-[#4F46E5]">
              {formatPrice(project.suggestedSellingPrice ?? project.companyValuation)}
            </span>
            {project.annualRevenue != null && project.annualRevenue > 0 && (
              <span className="text-[#6E6E80]">
                Rev: {formatPrice(project.annualRevenue)}
              </span>
            )}
            {project.expectedROI != null && project.expectedROI > 0 && (
              <span className="flex items-center gap-1 text-[#10B981]">
                <TrendingUp className="size-3" />
                {project.expectedROI}%
              </span>
            )}
          </div>

          {/* Seller */}
          {project.seller && (
            <div className="mt-3 flex items-center gap-2 border-t border-[#F3F4F6] pt-3">
              <div className="flex size-6 items-center justify-center rounded-full bg-[#4F46E5]/10 text-xs font-bold text-[#4F46E5]">
                {project.seller.name.charAt(0).toUpperCase()}
              </div>
              <span className="truncate text-xs text-[#6E6E80]">
                {project.seller.name}
              </span>
              {project.seller.verified && (
                <BadgeCheck className="size-3.5 text-[#4F46E5]" />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/projects?limit=6&sortBy=revenue_high');
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects ?? data ?? []);
        }
      } catch {
        // Silently fail — empty state shown
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="f5-section-heading text-2xl font-bold tracking-tight text-[#0D0C22] sm:text-3xl lg:text-4xl">
            Featured Opportunities
          </h2>
          <p className="mt-3 text-[#6E6E80] sm:text-lg">
            Hand-picked projects from verified sellers
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project, i) => (
              <FeaturedProjectCard
                key={project.id}
                project={project}
                index={i}
              />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E7EB] py-16 text-center">
            <p className="text-[#6E6E80]">
              Featured projects are loading&hellip;
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
