'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Eye,
  TrendingUp,
  DollarSign,
  MapPin,
  Users,
  PackageOpen,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { CATEGORY_ICONS, CATEGORIES } from '@/lib/constants';
import type { Project } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectGridProps {
  projects: Project[];
  isLoading?: boolean;
}

/* ---------- Helpers ---------- */

const CATEGORY_GRADIENTS: Record<string, string> = {
  'SaaS': 'from-emerald-500/20 to-teal-600/20',
  'AI Solutions': 'from-violet-500/20 to-fuchsia-600/20',
  'E-commerce': 'from-orange-500/20 to-amber-600/20',
  'Real Estate': 'from-cyan-500/20 to-sky-600/20',
  'Mobile Apps': 'from-pink-500/20 to-rose-600/20',
  'Startups': 'from-lime-500/20 to-green-600/20',
  'FinTech': 'from-emerald-600/20 to-green-700/20',
  'HealthTech': 'from-red-400/20 to-pink-500/20',
  'EdTech': 'from-yellow-500/20 to-orange-500/20',
  'Cybersecurity': 'from-slate-500/20 to-zinc-600/20',
  'CRM/ERP': 'from-teal-500/20 to-cyan-600/20',
  'Retail': 'from-amber-500/20 to-yellow-600/20',
  'Wholesale': 'from-stone-500/20 to-neutral-600/20',
  'Investments': 'from-green-500/20 to-emerald-600/20',
  'Domains': 'from-purple-400/20 to-violet-500/20',
  'Digital Products': 'from-rose-400/20 to-pink-500/20',
  'Manufacturing': 'from-zinc-500/20 to-stone-600/20',
  'Websites': 'from-sky-400/20 to-cyan-500/20',
};

function getCategoryGradient(category: string): string {
  if (CATEGORY_GRADIENTS[category]) return CATEGORY_GRADIENTS[category];
  // Deterministic hash-based gradient for unknown categories
  const hash = category.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const gradients = [
    'from-emerald-500/20 to-teal-600/20',
    'from-orange-500/20 to-amber-600/20',
    'from-violet-500/20 to-fuchsia-600/20',
    'from-rose-400/20 to-pink-500/20',
    'from-cyan-500/20 to-sky-600/20',
    'from-lime-500/20 to-green-600/20',
  ];
  return gradients[hash % gradients.length];
}

function getCategoryIconName(category: string): string {
  const cat = CATEGORIES.find((c) => c.name === category);
  if (cat && cat.icon && CATEGORY_ICONS[cat.icon]) {
    return cat.icon;
  }
  return 'PackageOpen';
}

function formatCurrency(value: number | undefined): string {
  if (value === undefined || value === null) return '—';
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function formatROI(value: number | undefined): string {
  if (value === undefined || value === null) return '—';
  return `${value}%`;
}

const STAGE_LABELS: Record<string, string> = {
  idea: 'Idea',
  startup: 'Startup',
  growth: 'Growth',
  mature: 'Mature',
  exit: 'Exit',
};

/* ---------- Skeleton Card ---------- */

function SkeletonCard() {
  return (
    <Card className="overflow-hidden border shadow-sm">
      <Skeleton className="h-40 w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-12 rounded-md" />
          <Skeleton className="h-12 rounded-md" />
          <Skeleton className="h-12 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}

/* ---------- Empty State ---------- */

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <PackageOpen className="size-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No projects found</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Try adjusting your search filters or browse without filters to discover available projects.
      </p>
    </motion.div>
  );
}

/* ---------- Project Card ---------- */

function CategoryIconDisplay({ iconName, className }: { iconName: string; className?: string }) {
  const Icon = CATEGORY_ICONS[iconName] || PackageOpen;
  return <Icon className={className} />;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { goToProject } = useAppStore();
  const iconKey = getCategoryIconName(project.category);
  const gradient = getCategoryGradient(project.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
    >
      <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow group">
        {/* Thumbnail */}
        <div
          className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}
        >
          <CategoryIconDisplay iconName={iconKey} className="size-12 text-foreground/40" />

          {project.featured && (
            <div className="absolute top-3 left-3">
              <Badge className="gap-1 bg-amber-500 text-white border-amber-500 text-[10px]">
                <Star className="size-3 fill-current" />
                Featured
              </Badge>
            </div>
          )}

          {project.status === 'active' && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-green-500/90 text-white border-green-500/90 text-[10px]">
                Active
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Project Name */}
          <h3 className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {project.name}
          </h3>

          {/* Badges Row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {project.category}
            </Badge>
            {project.country && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-0.5">
                <MapPin className="size-2.5" />
                {project.country.length > 12 ? project.country.slice(0, 12) + '…' : project.country}
              </Badge>
            )}
            {project.businessStage && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {STAGE_LABELS[project.businessStage] || project.businessStage}
              </Badge>
            )}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted/50 rounded-md px-2 py-1.5 text-center">
              <p className="text-[10px] text-muted-foreground leading-tight">Revenue</p>
              <p className="text-xs font-semibold mt-0.5">
                {formatCurrency(project.annualRevenue)}
              </p>
            </div>
            <div className="bg-muted/50 rounded-md px-2 py-1.5 text-center">
              <p className="text-[10px] text-muted-foreground leading-tight">ROI</p>
              <p className="text-xs font-semibold mt-0.5 text-green-600 dark:text-green-400">
                {formatROI(project.expectedROI)}
              </p>
            </div>
            <div className="bg-muted/50 rounded-md px-2 py-1.5 text-center">
              <p className="text-[10px] text-muted-foreground leading-tight">Price</p>
              <p className="text-xs font-semibold mt-0.5">
                {formatCurrency(project.suggestedSellingPrice)}
              </p>
            </div>
          </div>

          {/* Seller Info */}
          {project.seller && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="size-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
                  {project.seller.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {project.seller.name}
                </span>
                {project.seller.verified && (
                  <div className="size-3.5 rounded-full bg-green-500/10 flex items-center justify-center">
                    <div className="size-1.5 rounded-full bg-green-500" />
                  </div>
                )}
              </div>
              {project._count && (
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Users className="size-3" />
                  {project._count.offers} offer{project._count.offers !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}

          {/* View Details Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5 text-xs mt-1"
            onClick={() => goToProject(project.id)}
          >
            <Eye className="size-3.5" />
            View Details
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ---------- Main Grid ---------- */

export default function ProjectGrid({ projects, isLoading = false }: ProjectGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}