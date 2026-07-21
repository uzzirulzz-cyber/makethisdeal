'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Eye,
  TrendingUp,
  DollarSign,
  MapPin,
  Users,
  PackageOpen,
  ShoppingCart,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/store/use-app-store';
import { CATEGORY_ICONS, getCategoryName, getCategoryIconKey } from '@/lib/constants';
import { formatCompact } from '@/lib/currency';
import type { Project } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrency } from '@/hooks/use-currency';

interface ProjectGridProps {
  projects: Project[];
  isLoading?: boolean;
}

/* ---------- Helpers ---------- */

const CATEGORY_GRADIENTS: Record<string, string> = {
  'SaaS': 'from-[#8A2BE2]/15 to-[#A855F7]/15',
  'AI Solutions': 'from-[#A855F7]/15 to-[#EC4899]/15',
  'E-commerce': 'from-[#4DABF7]/15 to-[#8A2BE2]/15',
  'Real Estate': 'from-[#EC4899]/15 to-[#FF6B9D]/15',
  'Mobile Apps': 'from-[#8A2BE2]/15 to-[#4DABF7]/15',
  'Startups': 'from-[#A855F7]/15 to-[#8A2BE2]/15',
  'FinTech': 'from-[#4DABF7]/15 to-[#A855F7]/15',
  'HealthTech': 'from-[#EC4899]/15 to-[#8A2BE2]/15',
  'EdTech': 'from-[#FF6B9D]/15 to-[#4DABF7]/15',
  'Cybersecurity': 'from-[#8A2BE2]/15 to-[#EC4899]/15',
  'CRM/ERP': 'from-[#A855F7]/15 to-[#4DABF7]/15',
  'Retail': 'from-[#EC4899]/15 to-[#A855F7]/15',
  'Wholesale': 'from-[#4DABF7]/15 to-[#8A2BE2]/15',
  'Investments': 'from-[#8A2BE2]/15 to-[#FF6B9D]/15',
  'Domains': 'from-[#A855F7]/15 to-[#EC4899]/15',
  'Digital Products': 'from-[#EC4899]/15 to-[#A855F7]/15',
  'Manufacturing': 'from-[#4DABF7]/15 to-[#8A2BE2]/15',
  'Websites': 'from-[#8A2BE2]/15 to-[#4DABF7]/15',
};

function getCategoryGradient(category: string): string {
  if (CATEGORY_GRADIENTS[category]) return CATEGORY_GRADIENTS[category];
  // Deterministic hash-based gradient for unknown categories (violet/pink/blue tones)
  const hash = category.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const gradients = [
    'from-[#8A2BE2]/15 to-[#A855F7]/15',
    'from-[#A855F7]/15 to-[#EC4899]/15',
    'from-[#4DABF7]/15 to-[#8A2BE2]/15',
    'from-[#EC4899]/15 to-[#FF6B9D]/15',
    'from-[#8A2BE2]/15 to-[#4DABF7]/15',
    'from-[#A855F7]/15 to-[#8A2BE2]/15',
    'from-[#4DABF7]/15 to-[#A855F7]/15',
  ];
  return gradients[hash % gradients.length];
}

function getCategoryIconName(category: string): string {
  return getCategoryIconKey(category);
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
    <Card className="overflow-hidden border border-[#F0F0F0] rounded-lg shadow-sm">
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
      <div className="w-24 h-24 rounded-full bg-[#F3E8FF] flex items-center justify-center mb-6">
        <PackageOpen className="size-10 text-[#8A2BE2]" />
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
  const { goToProject, addToCart } = useAppStore();
  const { formatPrice, mode, symbol, convert } = useCurrency();
  const iconKey = getCategoryIconName(project.category);
  const gradient = getCategoryGradient(project.category);
  const [addedToCart, setAddedToCart] = useState(false);
  const [adding, setAdding] = useState(false);

  const hasPrice = !!project.suggestedSellingPrice && project.suggestedSellingPrice > 0;

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasPrice || adding) return;
    setAdding(true);
    const success = await addToCart(project.id, project.suggestedSellingPrice!, 'suggestedSellingPrice');
    setAdding(false);
    if (success) {
      setAddedToCart(true);
      toast.success(`Added "${project.name}" to cart`);
      setTimeout(() => setAddedToCart(false), 2000);
    } else {
      toast.error('Failed to add to cart');
    }
  }, [hasPrice, adding, addToCart, project.id, project.suggestedSellingPrice, project.name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
    >
      <Card className="overflow-hidden border border-[#F0F0F0] rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
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
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-[#F0F0F0]">
              {getCategoryName(project.category)}
            </Badge>
            {project.country && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-0.5 border-[#F0F0F0]">
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
                {formatPrice(project.annualRevenue)}
              </p>
            </div>
            <div className="bg-muted/50 rounded-md px-2 py-1.5 text-center">
              <p className="text-[10px] text-muted-foreground leading-tight">ROI</p>
              <p className="text-xs font-semibold mt-0.5 text-green-600 dark:text-green-400">
                {formatROI(project.expectedROI)}
              </p>
            </div>
            <div className="rounded-md px-2 py-1.5 text-center" style={{ backgroundColor: 'rgba(138,43,226,0.05)' }}>
              <p className="text-[10px] text-muted-foreground leading-tight">Price</p>
              <p className="text-xs font-bold mt-0.5 text-[#8A2BE2]">
                {formatPrice(project.suggestedSellingPrice)}
              </p>
            </div>
          </div>

          {/* Seller Info */}
          {project.seller && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="size-5 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[10px] font-medium text-[#8A2BE2]">
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

          {/* Actions Row */}
          <div className="flex items-center gap-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5 text-xs border-[#8A2BE2] text-[#8A2BE2] hover:bg-[#8A2BE2] hover:text-white"
              onClick={() => goToProject(project.id)}
            >
              <Eye className="size-3.5" />
              View Details
            </Button>
            <button
              onClick={handleAddToCart}
              disabled={!hasPrice || adding}
              className="p-2 rounded-lg border border-[#F0F0F0] transition-all duration-200 shrink-0"
              style={{
                backgroundColor: addedToCart ? 'rgba(138,43,226,0.1)' : '#fff',
                borderColor: addedToCart ? '#8A2BE2' : '#F0F0F0',
                color: addedToCart ? '#8A2BE2' : !hasPrice ? '#D1D5DB' : '#8A2BE2',
                cursor: hasPrice ? 'pointer' : 'not-allowed',
              }}
              title={hasPrice ? 'Add to Cart' : 'No price set'}
              aria-label={hasPrice ? 'Add to cart' : 'No price available'}
            >
              {addedToCart ? (
                <Check className="size-4" />
              ) : (
                <ShoppingCart className="size-4" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ---------- Main Grid ---------- */

export default function ProjectGrid({ projects, isLoading = false }: ProjectGridProps) {
  const { formatPrice, mode, symbol, convert, rateDisplay } = useCurrency();
  const pkrToUsd = useAppStore((s) => s.pkrToUsd);

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

  // Cumulative portfolio value
  const totalPKR = projects.reduce((sum, p) => sum + (p.suggestedSellingPrice || 0), 0);
  const oppositeMode = mode === 'PKR' ? 'USD' as const : 'PKR' as const;
  const secondaryFormatted = formatCompact(totalPKR, oppositeMode, pkrToUsd);

  return (
    <>
      {/* Cumulative Portfolio Banner */}
      {totalPKR > 0 && (
        <div className="mb-6 rounded-lg border border-[#F0F0F0] bg-gradient-to-r from-[#8A2BE2]/5 via-[#EC4899]/5 to-[#4DABF7]/5 p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cumulative Portfolio Value</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#8A2BE2] mt-0.5">
                {formatPrice(totalPKR)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{mode === 'PKR' ? 'US$ Equivalent' : 'PKR Equivalent'}</p>
              <p className="text-2xl sm:text-3xl font-bold mt-0.5">
                ≈ {secondaryFormatted}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>{projects.length} Projects Listed</span>
            <span className="size-1 rounded-full bg-[#8A2BE2]/20" />
            <span>All prices in {symbol}</span>
            <span className="size-1 rounded-full bg-[#8A2BE2]/20" />
            <span>Rate: {rateDisplay}</span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </>
  );
}