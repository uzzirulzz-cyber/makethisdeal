'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { CATEGORIES, COUNTRIES, BUSINESS_STAGES, SORT_OPTIONS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface ProjectFiltersProps {
  onApply?: () => void;
}

function FilterContent({ onApply, onMobileClose }: { onApply?: () => void; onMobileClose?: () => void }) {
  const { searchFilters, setSearchFilters, resetFilters } = useAppStore();

  const [localFilters, setLocalFilters] = useState(searchFilters);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    location: true,
    pricing: true,
    business: true,
    sort: true,
  });

  const updateFilter = useCallback(
    (key: string, value: string | number | undefined) => {
      setLocalFilters((prev) => ({ ...prev, [key]: value || undefined }));
    },
    []
  );

  const applyFilters = useCallback(() => {
    setSearchFilters(localFilters);
    onApply?.();
    onMobileClose?.();
  }, [localFilters, setSearchFilters, onApply, onMobileClose]);

  const handleReset = useCallback(() => {
    const reset: Record<string, string | number | undefined> = {
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
    };
    setLocalFilters(reset);
    resetFilters();
    onApply?.();
    onMobileClose?.();
  }, [resetFilters, onApply, onMobileClose]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFilterCount = Object.entries(localFilters).filter(
    ([key, val]) => val !== undefined && val !== '' && val !== 'newest' && key !== 'page' && key !== 'limit'
  ).length;

  return (
    <div className="space-y-1">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={localFilters.query || ''}
          onChange={(e) => updateFilter('query', e.target.value)}
          className="pl-9 w-full border-[#F0F0F0] focus:ring-[#8A2BE2]/30 focus:border-[#8A2BE2]"
        />
      </div>

      <Separator className="my-3" />

      {/* Active Filters Count */}
      {activeFilterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-3"
        >
          <Badge className="text-xs bg-[rgba(138,43,226,0.1)] text-[#8A2BE2] border-0">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
          </Badge>
          <button
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-[#8A2BE2] transition-colors"
          >
            Clear all
          </button>
        </motion.div>
      )}

      <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1 custom-scrollbar">
        {/* Category Filter */}
        <Collapsible open={openSections.category} onOpenChange={() => toggleSection('category')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
            <span>Category</span>
            <ChevronDown
              className={`size-4 text-muted-foreground transition-transform ${
                openSections.category ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Select
              value={localFilters.category || ''}
              onValueChange={(v) => updateFilter('category', v)}
            >
              <SelectTrigger className="w-full border-[#F0F0F0] focus:ring-[#8A2BE2]/30 focus:border-[#8A2BE2]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Country Filter */}
        <Collapsible open={openSections.location} onOpenChange={() => toggleSection('location')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
            <span>Location</span>
            <ChevronDown
              className={`size-4 text-muted-foreground transition-transform ${
                openSections.location ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Select
              value={localFilters.country || ''}
              onValueChange={(v) => updateFilter('country', v)}
            >
              <SelectTrigger className="w-full border-[#F0F0F0] focus:ring-[#8A2BE2]/30 focus:border-[#8A2BE2]">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Price Range */}
        <Collapsible open={openSections.pricing} onOpenChange={() => toggleSection('pricing')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
            <span>Price Range</span>
            <ChevronDown
              className={`size-4 text-muted-foreground transition-transform ${
                openSections.pricing ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Min Price</Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={localFilters.priceMin || ''}
                      onChange={(e) =>
                        updateFilter('priceMin', e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="pl-6 h-8 text-sm border-[#F0F0F0] focus:ring-[#8A2BE2]/30 focus:border-[#8A2BE2]"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Max Price</Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="∞"
                      value={localFilters.priceMax || ''}
                      onChange={(e) =>
                        updateFilter('priceMax', e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="pl-6 h-8 text-sm border-[#F0F0F0] focus:ring-[#8A2BE2]/30 focus:border-[#8A2BE2]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Min Revenue</Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={localFilters.revenueMin || ''}
                      onChange={(e) =>
                        updateFilter('revenueMin', e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="pl-6 h-8 text-sm border-[#F0F0F0] focus:ring-[#8A2BE2]/30 focus:border-[#8A2BE2]"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Max Revenue</Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="∞"
                      value={localFilters.revenueMax || ''}
                      onChange={(e) =>
                        updateFilter('revenueMax', e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="pl-6 h-8 text-sm border-[#F0F0F0] focus:ring-[#8A2BE2]/30 focus:border-[#8A2BE2]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Min ROI (%)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 50"
                  value={localFilters.roiMin || ''}
                  onChange={(e) =>
                    updateFilter('roiMin', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="h-8 text-sm border-[#F0F0F0] focus:ring-[#8A2BE2]/30 focus:border-[#8A2BE2]"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Business Stage */}
        <Collapsible open={openSections.business} onOpenChange={() => toggleSection('business')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
            <span>Business Stage</span>
            <ChevronDown
              className={`size-4 text-muted-foreground transition-transform ${
                openSections.business ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Select
              value={localFilters.businessStage || ''}
              onValueChange={(v) => updateFilter('businessStage', v)}
            >
              <SelectTrigger className="w-full border-[#F0F0F0] focus:ring-[#8A2BE2]/30 focus:border-[#8A2BE2]">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {BUSINESS_STAGES.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Sort By */}
        <Collapsible open={openSections.sort} onOpenChange={() => toggleSection('sort')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
            <span>Sort By</span>
            <ChevronDown
              className={`size-4 text-muted-foreground transition-transform ${
                openSections.sort ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Select
              value={localFilters.sortBy || 'newest'}
              onValueChange={(v) => updateFilter('sortBy', v)}
            >
              <SelectTrigger className="w-full border-[#F0F0F0] focus:ring-[#8A2BE2]/30 focus:border-[#8A2BE2]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Separator className="my-3" />

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={applyFilters}
          className="flex-1 bg-[#8A2BE2] hover:bg-[#7A1FE0] text-white border-0"
          size="sm"
        >
          Apply Filters
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="gap-1.5 border-[#8A2BE2] text-[#8A2BE2] hover:bg-[#8A2BE2] hover:text-white"
        >
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
      </div>
    </div>
  );
}

export default function ProjectFilters({ onApply }: ProjectFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24">
          <div className="bg-white border border-[#F0F0F0] rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="size-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm text-[#333333]">Filters</h3>
            </div>
            <FilterContent onApply={onApply} />
          </div>
        </div>
      </aside>

      {/* Mobile Filter Button & Sheet */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 border-[#8A2BE2] text-[#8A2BE2] hover:bg-[#8A2BE2] hover:text-white">
              <Filter className="size-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto bg-white">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-[#333333]">
                <SlidersHorizontal className="size-4" />
                Filters
              </SheetTitle>
              <SheetDescription>Refine your project search</SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-4">
              <FilterContent onApply={onApply} onMobileClose={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}