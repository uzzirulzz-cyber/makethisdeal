'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/use-app-store';
import { CATEGORY_ICONS, CATEGORIES } from '@/lib/constants';
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
  'from-emerald-400/20 to-teal-500/20',
  'from-teal-400/20 to-cyan-500/20',
  'from-green-400/20 to-emerald-500/20',
  'from-lime-400/20 to-green-500/20',
  'from-emerald-300/20 to-teal-400/20',
  'from-teal-300/20 to-green-400/20',
];

function formatPKR(value?: number): string {
  if (value == null) return '—';
  if (value >= 1_000_000) return `PKR ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `PKR ${(value / 1_000).toFixed(0)}K`;
  return `PKR ${value.toLocaleString()}`;
}
function formatCurrency(value?: number): string { return formatPKR(value); }

function renderCategoryIcon(categoryName: string, className: string) {
  const cat = CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );
  if (!cat || !cat.icon) return null;
  const IconComponent = CATEGORY_ICONS[cat.icon];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
}

function ProjectCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 py-0 shadow-sm">
      <Skeleton className="h-40 w-full rounded-none" />
      <CardContent className="space-y-3 p-4">
        <Skeleton className="h-4 w-16" />
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
      </CardContent>
    </Card>
  );
}

function FeaturedProjectCard({ project, index }: { project: Project; index: number }) {
  const goToProject = useAppStore((s) => s.goToProject);
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <motion.div variants={cardVariants}>
      <Card
        className="group cursor-pointer overflow-hidden border-0 py-0 shadow-sm transition-shadow hover:shadow-lg"
        onClick={() => goToProject(project.id)}
      >
        {/* Thumbnail placeholder */}
        <div
          className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${gradient}`}
        >
          {renderCategoryIcon(project.category, 'size-12 text-primary/40 transition-transform group-hover:scale-110')}
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 bg-white/90 text-xs font-medium text-foreground backdrop-blur-sm dark:bg-black/60 dark:text-white"
          >
            {project.category}
          </Badge>
          {project.status === 'active' && (
            <Badge className="absolute right-3 top-3 bg-emerald-500 text-xs text-white">
              Active
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          {/* Project Name */}
          <h3 className="truncate text-base font-semibold leading-snug group-hover:text-primary">
            {project.name}
          </h3>

          {/* Country */}
          {project.country && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              <span>{project.country}</span>
            </div>
          )}

          {/* Key Metrics */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span className="font-semibold text-primary">
              {formatCurrency(project.suggestedSellingPrice ?? project.companyValuation)}
            </span>
            {project.annualRevenue != null && project.annualRevenue > 0 && (
              <span className="text-muted-foreground">
                Rev: {formatCurrency(project.annualRevenue)}
              </span>
            )}
            {project.expectedROI != null && project.expectedROI > 0 && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-3" />
                {project.expectedROI}%
              </span>
            )}
          </div>

          {/* Seller */}
          {project.seller && (
            <div className="mt-3 flex items-center gap-2 border-t pt-3">
              <div className="flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                {project.seller.name.charAt(0).toUpperCase()}
              </div>
              <span className="truncate text-xs text-muted-foreground">
                {project.seller.name}
              </span>
              {project.seller.verified && (
                <BadgeCheck className="size-3.5 text-primary" />
              )}
            </div>
          )}
        </CardContent>
      </Card>
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
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Featured Opportunities
          </h2>
          <p className="mt-3 text-muted-foreground sm:text-lg">
            Hand-picked projects from verified sellers
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
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
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6"
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
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <p className="text-muted-foreground">
              Featured projects are loading&hellip;
            </p>
          </div>
        )}
      </div>
    </section>
  );
}