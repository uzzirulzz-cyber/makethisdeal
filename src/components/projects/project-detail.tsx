'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  ExternalLink,
  Globe,
  Monitor,
  Github,
  Smartphone,
  Shield,
  Users,
  Eye,
  TrendingUp,
  Heart,
  MessageSquare,
  Gavel,
  Sparkles,
  MapPin,
  Building2,
  Calendar,
  BarChart3,
  Target,
  Zap,
  AlertTriangle,
  DoorOpen,
  Copy,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { CATEGORY_ICONS, getCategoryName, getCategoryIconKey } from '@/lib/constants';
import type { Project, Offer } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

/* ---------- Helpers ---------- */

function formatPKR(value: number | undefined): string {
  if (value === undefined || value === null) return '—';
  if (value >= 1_000_000) return `PKR ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `PKR ${(value / 1_000).toFixed(0)}K`;
  return `PKR ${value.toLocaleString()}`;
}

function toUSD(pkr: number): number { return Math.round(pkr / 278); }

function formatUSD(pkr: number | undefined): string {
  if (pkr === undefined || pkr === null) return '';
  const u = toUSD(pkr);
  if (u >= 1_000_000) return `≈ US$ ${(u / 1_000_000).toFixed(1)}M`;
  if (u >= 1_000) return `≈ US$ ${(u / 1_000).toFixed(1)}K`;
  return `≈ US$ ${u.toLocaleString()}`;
}

function formatCurrency(value: number | undefined): string { return formatPKR(value); }

function formatNumber(value: number | undefined): string {
  if (value === undefined || value === null) return '—';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function getCategoryIconName(category: string): string {
  return getCategoryIconKey(category);
}

function getCategoryGradient(category: string): string {
  const name = getCategoryName(category);
  const map: Record<string, string> = {
    'SaaS': 'from-emerald-500/30 to-teal-600/30',
    'AI Solutions': 'from-violet-500/30 to-fuchsia-600/30',
    'E-commerce': 'from-orange-500/30 to-amber-600/30',
    'Real Estate': 'from-cyan-500/30 to-sky-600/30',
    'Mobile Apps': 'from-pink-500/30 to-rose-600/30',
    'Startups': 'from-lime-500/30 to-green-600/30',
    'FinTech': 'from-emerald-600/30 to-green-700/30',
    'HealthTech': 'from-red-400/30 to-pink-500/30',
    'EdTech': 'from-yellow-500/30 to-orange-500/30',
    'Cybersecurity': 'from-slate-500/30 to-zinc-600/30',
    'Domains': 'from-purple-400/30 to-violet-500/30',
    'Websites': 'from-sky-400/30 to-cyan-500/30',
  };
  return map[name] || 'from-stone-500/30 to-neutral-600/30';
}

const STAGE_LABELS: Record<string, string> = {
  idea: 'Idea / Concept',
  startup: 'Startup',
  growth: 'Growth Stage',
  mature: 'Mature Business',
  exit: 'Exit / Acquisition',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/* ---------- Skeleton ---------- */

function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Skeleton className="h-8 w-24" />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
      </div>
    </div>
  );
}

/* ---------- Financial Table ---------- */

function FinancialTable({ project }: { project: Project }) {
  const rows = [
    { label: 'Development Cost', value: project.developmentCost },
    { label: 'Infrastructure Cost', value: project.infrastructureCost },
    { label: 'Marketing Cost', value: project.marketingCost },
    { label: 'Legal Cost', value: project.legalCost },
    { label: 'Operational Cost', value: project.operationalCost },
    { label: 'Technology Cost', value: project.technologyCost },
    { label: 'Maintenance Cost', value: project.maintenanceCost },
    { label: 'Total Investment', value: project.totalInvestment, bold: true },
    { label: 'Monthly Revenue', value: project.monthlyRevenue },
    { label: 'Annual Revenue', value: project.annualRevenue, bold: true },
    { label: 'Net Profit', value: project.netProfit, bold: true },
    { label: 'EBITDA', value: project.ebitda },
    { label: 'Expected ROI', value: project.expectedROI, isPercent: true, bold: true },
    { label: 'Company Valuation', value: project.companyValuation, bold: true },
  ];

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left font-medium px-4 py-2.5 text-muted-foreground">Metric</th>
            <th className="text-right font-medium px-4 py-2.5 text-muted-foreground">Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
            >
              <td className={`px-4 py-2.5 ${row.bold ? 'font-semibold' : 'text-muted-foreground'}`}>
                {row.label}
              </td>
              <td className={`text-right px-4 py-2.5 ${row.bold ? 'font-semibold' : ''}`}>
                {row.isPercent
                  ? row.value !== undefined && row.value !== null
                    ? `${row.value}%`
                    : '—'
                  : formatCurrency(row.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Digital Assets ---------- */

function DigitalAssetLink({
  icon: Icon,
  label,
  url,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  url?: string;
}) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
    >
      <div className="size-9 rounded-md bg-muted flex items-center justify-center shrink-0">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{url}</p>
      </div>
      <ExternalLink className="size-4 text-muted-foreground shrink-0" />
    </a>
  );
}

/* ---------- Business Metrics ---------- */

function MetricBar({ label, value, max, suffix = '' }: { label: string; value?: number; max: number; suffix?: string }) {
  const pct = value !== undefined && value !== null ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value !== undefined && value !== null ? value.toLocaleString() : '—'}{suffix}
        </span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}

/* ---------- Main Component ---------- */

export default function ProjectDetail() {
  const { selectedProjectId, goBack, currentUser } = useAppStore();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    if (!selectedProjectId) return;
    let cancelled = false;

    async function fetchProject() {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${selectedProjectId}`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          setProject(data);
          setOffers(data.offers || []);
        }
      } catch {
        // Silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProject();
    return () => {
      cancelled = true;
    };
  }, [selectedProjectId]);

  if (loading) return <DetailSkeleton />;
  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Project not found.</p>
        <Button variant="outline" className="mt-4 gap-2" onClick={goBack}>
          <ArrowLeft className="size-4" /> Go Back
        </Button>
      </div>
    );
  }

  const iconKey = getCategoryIconName(project.category);
  const IconComp = CATEGORY_ICONS[iconKey] || Globe;
  const gradient = getCategoryGradient(project.category);
  const isOwner = currentUser && currentUser.id === project.sellerId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 py-6"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 mb-4 text-muted-foreground hover:text-foreground -ml-2"
        onClick={goBack}
      >
        <ArrowLeft className="size-4" />
        Back to Listings
      </Button>

      {/* Hero Section */}
      <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-6 md:p-8 mb-6`}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {project.featured && (
                <Badge className="gap-1 bg-amber-500 text-white border-amber-500">
                  <Star className="size-3 fill-current" />
                  Featured
                </Badge>
              )}
              <Badge variant="secondary" className="bg-green-500/90 text-white border-green-500/90">
                {project.status === 'active' ? 'Active' : project.status}
              </Badge>
              {project.businessStage && (
                <Badge variant="outline">
                  {STAGE_LABELS[project.businessStage] || project.businessStage}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{project.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <IconComp className="size-4" />
                {getCategoryName(project.category)}
              </span>
              {project.country && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {project.city ? `${project.city}, ` : ''}{project.country}
                </span>
              )}
              {project.foundedYear && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  Founded {project.foundedYear}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-transparent p-0 border-b rounded-none">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="financials"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3"
              >
                Financial Information
              </TabsTrigger>
              <TabsTrigger
                value="assets"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3"
              >
                Digital Assets
              </TabsTrigger>
              <TabsTrigger
                value="metrics"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3"
              >
                Business Metrics
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.overview || 'No overview provided.'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="size-4" />
                    Business Model
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.businessModel || 'Not specified.'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="size-4" />
                    Target Market
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.targetMarket || 'Not specified.'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="size-4" />
                    Revenue Model
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.revenueModel || 'Not specified.'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="size-4" />
                    Growth Opportunity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.growthOpportunity || 'Not specified.'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="size-4" />
                    Competitive Advantage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.competitiveAdvantage || 'Not specified.'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="size-4" />
                    Business Risks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.businessRisks || 'Not specified.'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <DoorOpen className="size-4" />
                    Exit Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.exitOpportunities || 'Not specified.'}
                  </p>
                </CardContent>
              </Card>

              {project.breakEvenAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Break-Even Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {project.breakEvenAnalysis}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financials" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="size-4" />
                    Financial Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FinancialTable project={project} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Digital Assets Tab */}
            <TabsContent value="assets" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="size-4" />
                    Digital Assets & Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DigitalAssetLink icon={Globe} label="Website" url={project.websiteUrl} />
                  <DigitalAssetLink icon={Monitor} label="Demo" url={project.demoUrl} />
                  <DigitalAssetLink icon={Github} label="GitHub Repository" url={project.githubRepo} />
                  <DigitalAssetLink icon={Smartphone} label="Google Play" url={project.googlePlayUrl} />
                  <DigitalAssetLink icon={Smartphone} label="Apple App Store" url={project.appleStoreUrl} />
                  <DigitalAssetLink icon={Monitor} label="Admin Panel Demo" url={project.adminPanelDemo} />
                  <DigitalAssetLink icon={Monitor} label="Customer Portal" url={project.customerPortalDemo} />
                  <DigitalAssetLink icon={Copy} label="API Documentation" url={project.apiDocumentation} />
                </CardContent>
              </Card>

              {(project.technologyStack || project.hostingProvider || project.cloudInfrastructure) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Technical Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {project.technologyStack && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">Technology Stack</p>
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologyStack.split(',').map((tech, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tech.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {project.hostingProvider && (
                      <div className="flex items-center justify-between py-1">
                        <span className="text-sm text-muted-foreground">Hosting Provider</span>
                        <span className="text-sm font-medium">{project.hostingProvider}</span>
                      </div>
                    )}
                    {project.cloudInfrastructure && (
                      <div className="flex items-center justify-between py-1">
                        <span className="text-sm text-muted-foreground">Cloud Infrastructure</span>
                        <span className="text-sm font-medium">{project.cloudInfrastructure}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-muted-foreground">Source Code</span>
                      <Badge variant={project.sourceCodeAvailable ? 'default' : 'outline'}>
                        {project.sourceCodeAvailable ? 'Available' : 'Not Included'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Metrics Tab */}
            <TabsContent value="metrics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="size-4" />
                    Business Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <MetricBar label="Monthly Visitors" value={project.monthlyVisitors} max={5_000_000} />
                  <MetricBar label="Monthly Active Users" value={project.monthlyActiveUsers} max={1_000_000} />
                  <MetricBar label="Registered Users" value={project.registeredUsers} max={2_000_000} />
                  <MetricBar label="Customers" value={project.customers} max={500_000} />
                  <MetricBar label="Subscribers" value={project.subscribers} max={200_000} />
                  <MetricBar label="Conversion Rate" value={project.conversionRate} max={100} suffix="%" />
                  <MetricBar label="SEO Score" value={project.seoScore} max={100} suffix="/100" />

                  {project.trafficSources && (
                    <div className="pt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">Traffic Sources</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.trafficSources.split(',').map((src, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {src.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT COLUMN (Sidebar) */}
        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {/* Price Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Gavel className="size-4" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-2">
                <p className="text-xs text-muted-foreground mb-1">Selling Price</p>
                <p className="text-3xl font-bold text-primary">{formatPKR(project.suggestedSellingPrice)}</p>
                {project.suggestedSellingPrice && project.suggestedSellingPrice >= 100000 && (
                  <p className="text-sm text-muted-foreground">{formatUSD(project.suggestedSellingPrice)}</p>
                )}
              </div>
              <Separator />
              <div className="space-y-2.5">
                {project.buyNowPrice !== undefined && project.buyNowPrice !== null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Buy Now Price</span>
                    <span className="font-medium">{formatCurrency(project.buyNowPrice)}</span>
                  </div>
                )}
                {project.reservePrice !== undefined && project.reservePrice !== null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reserve Price</span>
                    <span className="font-medium">{formatCurrency(project.reservePrice)}</span>
                  </div>
                )}
                {project.minimumOffer !== undefined && project.minimumOffer !== null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Min Offer</span>
                    <span className="font-medium">{formatCurrency(project.minimumOffer)}</span>
                  </div>
                )}
                {project.auctionEnabled && (
                  <Badge variant="outline" className="w-full justify-center py-1.5 text-xs gap-1.5">
                    <Gavel className="size-3" />
                    Auction Enabled
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Valuation Card */}
          {project.aiValuation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-violet-200 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 dark:from-violet-950/20 dark:to-fuchsia-950/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-violet-700 dark:text-violet-400">
                    <Sparkles className="size-4" />
                    AI Valuation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <div className="text-center py-1">
                    <p className="text-xs text-muted-foreground mb-1">Estimated Value</p>
                    <p className="text-2xl font-bold text-violet-700 dark:text-violet-400">
                      {formatCurrency(project.aiValuation)}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    {project.investorPrice !== undefined && project.investorPrice !== null && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Investor Price</span>
                        <span className="font-medium">{formatCurrency(project.investorPrice)}</span>
                      </div>
                    )}
                    {project.wholesalePrice !== undefined && project.wholesalePrice !== null && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Wholesale Price</span>
                        <span className="font-medium">{formatCurrency(project.wholesalePrice)}</span>
                      </div>
                    )}
                    {project.acquisitionPrice !== undefined && project.acquisitionPrice !== null && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Acquisition Price</span>
                        <span className="font-medium">{formatCurrency(project.acquisitionPrice)}</span>
                      </div>
                    )}
                  </div>
                  {project.valuationDetails && (
                    <>
                      <Separator />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {project.valuationDetails}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Seller Card */}
          {project.seller && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="size-4" />
                  Seller
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
                    {project.seller.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold truncate">{project.seller.name}</p>
                      {project.seller.verified && (
                        <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
                      )}
                    </div>
                    {project.seller.company && (
                      <p className="text-xs text-muted-foreground truncate">{project.seller.company}</p>
                    )}
                    {project.seller.country && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="size-3" />
                        {project.seller.country}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          {!isOwner && (
            <Card>
              <CardContent className="p-4 space-y-2.5">
                <Button className="w-full gap-2" size="sm">
                  <Gavel className="size-4" />
                  Make an Offer
                </Button>
                <Button variant="outline" className="w-full gap-2" size="sm">
                  <Heart className="size-4" />
                  Add to Favorites
                </Button>
                <Button variant="ghost" className="w-full gap-2" size="sm">
                  <MessageSquare className="size-4" />
                  Contact Seller
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recent Offers */}
          {offers.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="size-4" />
                  Recent Offers ({offers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {offers.slice(0, 5).map((offer) => (
                    <div
                      key={offer.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="size-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium shrink-0">
                          {offer.buyer?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">
                            {offer.buyer?.name || 'Anonymous'}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {formatDate(offer.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="text-xs font-semibold">{formatCurrency(offer.amount)}</p>
                        <Badge
                          variant={
                            offer.status === 'accepted'
                              ? 'default'
                              : offer.status === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                          }
                          className="text-[9px] px-1 py-0"
                        >
                          {offer.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posted Date */}
          <p className="text-xs text-center text-muted-foreground">
            Listed on {formatDate(project.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}