'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Heart,
  TrendingUp,
  DollarSign,
  FolderOpen,
  Send,
  Sparkles,
  Pencil,
  Trash2,
  ArrowRight,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
  PackageOpen,
  LayoutGrid,
  BarChart3,
  Calculator,
  Star,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { CATEGORIES, BUSINESS_STAGES, COUNTRIES, TECHNOLOGY_STACKS, CATEGORY_ICONS } from '@/lib/constants';
import type { Project, Offer, ProjectStatus, OfferStatus } from '@/lib/types';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ValuationResult {
  estimatedValue: number;
  recommendedPrice: number;
  investorPrice: number;
  wholesalePrice: number;
  acquisitionPrice: number;
  confidenceScore: number;
  valuationDetails: string;
  keyFactors: string[];
}

interface ValuationForm {
  projectName: string;
  category: string;
  industry: string;
  country: string;
  businessStage: string;
  annualRevenue: string;
  monthlyRevenue: string;
  netProfit: string;
  ebitda: string;
  totalInvestment: string;
  monthlyVisitors: string;
  registeredUsers: string;
  customers: string;
  subscribers: string;
  technologyStack: string;
  competitiveAdvantage: string;
  growthOpportunity: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const statusConfig: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  active: {
    label: 'Active',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  },
  sold: {
    label: 'Sold',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  },
  paused: {
    label: 'Paused',
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400 border-gray-200 dark:border-gray-700',
  },
  draft: {
    label: 'Draft',
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  },
};

const offerStatusConfig: Record<
  OfferStatus,
  { label: string; icon: typeof Clock; className: string }
> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle2,
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800',
  },
  withdrawn: {
    label: 'Withdrawn',
    icon: XCircle,
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400 border-gray-200 dark:border-gray-700',
  },
};

const emptyForm: ValuationForm = {
  projectName: '',
  category: '',
  industry: '',
  country: '',
  businessStage: '',
  annualRevenue: '',
  monthlyRevenue: '',
  netProfit: '',
  ebitda: '',
  totalInvestment: '',
  monthlyVisitors: '',
  registeredUsers: '',
  customers: '',
  subscribers: '',
  technologyStack: '',
  competitiveAdvantage: '',
  growthOpportunity: '',
};

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const cardHover = {
  scale: 1.015,
  transition: { type: 'spring', stiffness: 400, damping: 25 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function UserDashboard() {
  const {
    currentUser,
    projects,
    setProjects,
    goToProject,
    setCurrentView,
  } = useAppStore();

  // ---- local state ----
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [favorites, setFavorites] = useState<Project[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  // valuation
  const [vForm, setVForm] = useState<ValuationForm>(emptyForm);
  const [vLoading, setVLoading] = useState(false);
  const [vResult, setVResult] = useState<ValuationResult | null>(null);
  const [vError, setVError] = useState<string | null>(null);

  // ---- data fetching ----
  const fetchDashboardData = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/projects?sellerId=' + currentUser.id);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setProjects(data);
        else if (data.projects) setProjects(data.projects);
      }

      const offersRes = await fetch('/api/offers?buyerId=' + currentUser.id);
      if (offersRes.ok) {
        const offersData = await offersRes.json();
        if (Array.isArray(offersData)) setMyOffers(offersData);
        else if (offersData.offers) setMyOffers(offersData.offers);
      }

      const favRes = await fetch('/api/favorites?userId=' + currentUser.id);
      if (favRes.ok) {
        const favData = await favRes.json();
        if (Array.isArray(favData)) setFavorites(favData);
        else if (favData.projects) setFavorites(favData.projects);
      }
    } catch {
      // silently fail – the store data will still be used
    }
  }, [currentUser, setProjects]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ---- derived data ----
  const myProjects = currentUser
    ? projects.filter((p) => p.sellerId === currentUser.id)
    : [];

  const activeOffers = myOffers.filter((o) => o.status === 'pending').length;

  const totalPortfolioValue = myProjects.reduce(
    (sum, p) => sum + (p.companyValuation ?? p.suggestedSellingPrice ?? 0),
    0,
  );

  // ---- delete handler ----
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch('/api/projects/' + deleteTarget.id, { method: 'DELETE' });
      setProjects(projects.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      // keep dialog open on error
    } finally {
      setDeleting(false);
    }
  };

  // ---- valuation handler ----
  const handleValuation = async () => {
    if (!vForm.projectName.trim()) return;
    setVLoading(true);
    setVError(null);
    setVResult(null);
    try {
      const res = await fetch('/api/projects/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vForm),
      });
      if (!res.ok) throw new Error('Valuation request failed');
      const data = await res.json();
      setVResult(data);
    } catch {
      setVError('Something went wrong. Please try again.');
    } finally {
      setVLoading(false);
    }
  };

  // ---- render: not signed in ----
  if (!currentUser) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center"
      >
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <Briefcase className="size-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Sign in to your Dashboard</h2>
          <p className="max-w-md text-muted-foreground">
            Access your projects, manage offers, track favorites, and use the AI Valuation
            Engine — all in one place.
          </p>
        </div>
        <Button size="lg" onClick={() => {
          const { setCurrentUser } = useAppStore.getState();
          setCurrentUser({
            id: 'demo_user',
            email: 'demo@makethisdeal.com',
            name: 'Demo User',
            role: 'seller',
            company: 'Demo Corp',
            country: 'United States',
            verified: false,
            createdAt: new Date().toISOString(),
          });
        }}>
          Sign In
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </motion.section>
    );
  }

  // ---- render: dashboard ----
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8"
    >
      {/* ================================================================== */}
      {/* Welcome & Quick Stats                                               */}
      {/* ================================================================== */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {currentUser.name?.split(' ')[0] ?? 'there'}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s an overview of your marketplace activity.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:gap-4">
          {[
            {
              label: 'My Projects',
              value: myProjects.length,
              icon: LayoutGrid,
              color: 'text-emerald-600 dark:text-emerald-400',
              bg: 'bg-emerald-50 dark:bg-emerald-950/40',
            },
            {
              label: 'Active Offers',
              value: activeOffers,
              icon: Send,
              color: 'text-amber-600 dark:text-amber-400',
              bg: 'bg-amber-50 dark:bg-amber-950/40',
            },
            {
              label: 'Favorites',
              value: favorites.length,
              icon: Heart,
              color: 'text-rose-600 dark:text-rose-400',
              bg: 'bg-rose-50 dark:bg-rose-950/40',
            },
            {
              label: 'Portfolio Value',
              value: formatCurrency(totalPortfolioValue),
              icon: TrendingUp,
              color: 'text-violet-600 dark:text-violet-400',
              bg: 'bg-violet-50 dark:bg-violet-950/40',
            },
          ].map((stat) => (
            <Card key={stat.label} className="relative overflow-hidden">
              <CardContent className="flex items-center gap-3 p-4">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}
                >
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-lg font-bold tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* ================================================================== */}
      {/* Tabs                                                                */}
      {/* ================================================================== */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="flex w-full overflow-x-auto sm:w-auto">
            <TabsTrigger value="projects" className="gap-1.5">
              <LayoutGrid className="size-4" />
              <span className="hidden sm:inline">My Projects</span>
              <span className="sm:hidden">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-1.5">
              <Send className="size-4" />
              <span className="hidden sm:inline">My Offers</span>
              <span className="sm:hidden">Offers</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-1.5">
              <Heart className="size-4" />
              <span className="hidden sm:inline">Favorites</span>
              <span className="sm:hidden">Favs</span>
            </TabsTrigger>
            <TabsTrigger value="valuation" className="gap-1.5">
              <Calculator className="size-4" />
              <span className="hidden sm:inline">Valuation Tool</span>
              <span className="sm:hidden">Valuate</span>
            </TabsTrigger>
          </TabsList>

          {/* -------------------------------------------------------------- */}
          {/* Tab 1 – My Projects                                              */}
          {/* -------------------------------------------------------------- */}
          <TabsContent value="projects">
            <AnimatePresence mode="wait">
              {myProjects.length === 0 ? (
                <motion.div
                  key="empty-projects"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
                        <PackageOpen className="size-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">No projects yet</h3>
                        <p className="max-w-sm text-sm text-muted-foreground">
                          List your first project and start receiving offers from buyers
                          worldwide.
                        </p>
                      </div>
                      <Button onClick={() => setCurrentView('create')}>
                        <FolderOpen className="mr-2 size-4" />
                        List Your First Project
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="projects-grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {myProjects.map((project) => {
                    const CatIcon = CATEGORY_ICONS[project.category] ?? Briefcase;
                    const sc = statusConfig[project.status as ProjectStatus] ?? statusConfig.active;
                    return (
                      <motion.div key={project.id} variants={itemVariants} whileHover={cardHover}>
                        <Card className="group relative flex h-full cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-lg">
                          {/* thumbnail / icon header */}
                          <div
                            className="relative flex h-32 items-center justify-center bg-gradient-to-br from-muted to-muted/50"
                            onClick={() => goToProject(project.id)}
                          >
                            {project.thumbnail ? (
                              <img
                                src={project.thumbnail}
                                alt={project.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <CatIcon className="size-12 text-muted-foreground/40" />
                            )}
                            <Badge
                              variant="outline"
                              className={`absolute right-2 top-2 ${sc.className}`}
                            >
                              {sc.label}
                            </Badge>
                          </div>

                          <CardContent
                            className="flex flex-1 flex-col gap-2 p-4"
                            onClick={() => goToProject(project.id)}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="line-clamp-1 text-sm font-semibold leading-tight">
                                {project.name}
                              </h3>
                            </div>
                            <p className="text-xs text-muted-foreground">{project.category}</p>

                            <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
                              <span>
                                {project._count?.offers ?? 0} offer
                                {(project._count?.offers ?? 0) !== 1 ? 's' : ''}
                              </span>
                              <span>{formatDate(project.createdAt)}</span>
                            </div>

                            {/* price row */}
                            <div className="flex items-center gap-3 border-t pt-2 text-xs">
                              <div className="flex items-center gap-1 font-semibold text-foreground">
                                <DollarSign className="size-3" />
                                {formatCurrency(
                                  project.suggestedSellingPrice ?? project.companyValuation ?? 0,
                                )}
                              </div>
                              {project.annualRevenue != null && project.annualRevenue > 0 && (
                                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                  <TrendingUp className="size-3" />
                                  {formatCurrency(project.annualRevenue)}/yr
                                </div>
                              )}
                            </div>
                          </CardContent>

                          {/* action bar */}
                          <div className="flex border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1 rounded-none text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                goToProject(project.id);
                              }}
                            >
                              <Eye className="mr-1.5 size-3.5" />
                              View
                            </Button>
                            <Separator orientation="vertical" className="h-auto" />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1 rounded-none text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                goToProject(project.id);
                              }}
                            >
                              <Pencil className="mr-1.5 size-3.5" />
                              Edit
                            </Button>
                            <Separator orientation="vertical" className="h-auto" />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1 rounded-none text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget(project);
                              }}
                            >
                              <Trash2 className="mr-1.5 size-3.5" />
                              Delete
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* -------------------------------------------------------------- */}
          {/* Tab 2 – My Offers                                                */}
          {/* -------------------------------------------------------------- */}
          <TabsContent value="offers">
            <AnimatePresence mode="wait">
              {myOffers.length === 0 ? (
                <motion.div
                  key="empty-offers"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
                        <Send className="size-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">No offers yet</h3>
                        <p className="max-w-sm text-sm text-muted-foreground">
                          Browse available projects and make your first offer to get started.
                        </p>
                      </div>
                      <Button onClick={() => setCurrentView('browse')}>
                        <Search className="mr-2 size-4" />
                        Browse Projects
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="offers-list"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {myOffers.map((offer) => {
                    const sc =
                      offerStatusConfig[offer.status as OfferStatus] ??
                      offerStatusConfig.pending;
                    const StatusIcon = sc.icon;
                    return (
                      <motion.div key={offer.id} variants={itemVariants}>
                        <Card
                          className="cursor-pointer transition-shadow hover:shadow-md"
                          onClick={() => offer.projectId && goToProject(offer.projectId)}
                        >
                          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">
                                {offer.project?.name ?? 'Unknown Project'}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {offer.project?.category ?? '—'} &middot;{' '}
                                {formatDate(offer.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-sm font-bold">
                                  {formatCurrency(offer.amount)}
                                </p>
                                <p className="text-[11px] text-muted-foreground">Offer Amount</p>
                              </div>
                              <Badge
                                variant="outline"
                                className={`gap-1 ${sc.className}`}
                              >
                                <StatusIcon className="size-3" />
                                {sc.label}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* -------------------------------------------------------------- */}
          {/* Tab 3 – Favorites                                                */}
          {/* -------------------------------------------------------------- */}
          <TabsContent value="favorites">
            <AnimatePresence mode="wait">
              {favorites.length === 0 ? (
                <motion.div
                  key="empty-favorites"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                      <div className="flex size-16 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40">
                        <Heart className="size-8 text-rose-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">No favorites yet</h3>
                        <p className="max-w-sm text-sm text-muted-foreground">
                          Explore the marketplace and save projects you&apos;re interested in.
                        </p>
                      </div>
                      <Button onClick={() => setCurrentView('browse')}>
                        <Search className="mr-2 size-4" />
                        Start Exploring
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="favorites-grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {favorites.map((project) => {
                    const CatIcon = CATEGORY_ICONS[project.category] ?? Briefcase;
                    const sc = statusConfig[project.status as ProjectStatus] ?? statusConfig.active;
                    return (
                      <motion.div key={project.id} variants={itemVariants} whileHover={cardHover}>
                        <Card className="group relative flex h-full cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-lg">
                          <div
                            className="relative flex h-32 items-center justify-center bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/30 dark:to-rose-900/20"
                            onClick={() => goToProject(project.id)}
                          >
                            {project.thumbnail ? (
                              <img
                                src={project.thumbnail}
                                alt={project.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <CatIcon className="size-12 text-rose-300 dark:text-rose-700" />
                            )}
                            <Badge
                              variant="outline"
                              className={`absolute right-2 top-2 ${sc.className}`}
                            >
                              {sc.label}
                            </Badge>
                            <div className="absolute left-2 top-2">
                              <Heart className="size-5 fill-rose-500 text-rose-500" />
                            </div>
                          </div>

                          <CardContent
                            className="flex flex-1 flex-col gap-2 p-4"
                            onClick={() => goToProject(project.id)}
                          >
                            <h3 className="line-clamp-1 text-sm font-semibold leading-tight">
                              {project.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">{project.category}</p>
                            <div className="mt-auto flex items-center justify-between border-t pt-2 text-xs">
                              <span className="font-semibold text-foreground">
                                {formatCurrency(
                                  project.suggestedSellingPrice ?? project.companyValuation ?? 0,
                                )}
                              </span>
                              {project.seller && (
                                <span className="text-muted-foreground">
                                  by {project.seller.name}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* -------------------------------------------------------------- */}
          {/* Tab 4 – Valuation Tool                                           */}
          {/* -------------------------------------------------------------- */}
          <TabsContent value="valuation">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 lg:grid-cols-2"
            >
              {/* ---- Form ---- */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="size-5 text-amber-500" />
                      AI Valuation Engine
                    </CardTitle>
                    <CardDescription>
                      Enter your project details to get an instant AI-powered business valuation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Basic Info */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Basic Information</h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5 sm:col-span-2">
                          <Label htmlFor="v-projectName">Project Name *</Label>
                          <Input
                            id="v-projectName"
                            placeholder="My Awesome SaaS"
                            value={vForm.projectName}
                            onChange={(e) => setVForm((f) => ({ ...f, projectName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="v-category">Category</Label>
                          <Select
                            value={vForm.category}
                            onValueChange={(v) => setVForm((f) => ({ ...f, category: v }))}
                          >
                            <SelectTrigger id="v-category" className="w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map((c) => (
                                <SelectItem key={c.id} value={c.slug}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="v-industry">Industry</Label>
                          <Input
                            id="v-industry"
                            placeholder="e.g. FinTech"
                            value={vForm.industry}
                            onChange={(e) => setVForm((f) => ({ ...f, industry: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="v-country">Country</Label>
                          <Select
                            value={vForm.country}
                            onValueChange={(v) => setVForm((f) => ({ ...f, country: v }))}
                          >
                            <SelectTrigger id="v-country" className="w-full">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {COUNTRIES.map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="v-stage">Business Stage</Label>
                          <Select
                            value={vForm.businessStage}
                            onValueChange={(v) => setVForm((f) => ({ ...f, businessStage: v }))}
                          >
                            <SelectTrigger id="v-stage" className="w-full">
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                            <SelectContent>
                              {BUSINESS_STAGES.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Financial Info */}
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        <BarChart3 className="size-4 text-emerald-600 dark:text-emerald-400" />
                        Financial Metrics
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          { key: 'annualRevenue' as const, label: 'Annual Revenue ($)', placeholder: 'e.g. 120000' },
                          { key: 'monthlyRevenue' as const, label: 'Monthly Revenue ($)', placeholder: 'e.g. 10000' },
                          { key: 'netProfit' as const, label: 'Net Profit ($)', placeholder: 'e.g. 30000' },
                          { key: 'ebitda' as const, label: 'EBITDA ($)', placeholder: 'e.g. 45000' },
                          { key: 'totalInvestment' as const, label: 'Total Investment ($)', placeholder: 'e.g. 50000' },
                        ].map(({ key, label, placeholder }) => (
                          <div key={key} className="space-y-1.5">
                            <Label htmlFor={`v-${key}`}>{label}</Label>
                            <Input
                              id={`v-${key}`}
                              type="number"
                              placeholder={placeholder}
                              value={vForm[key]}
                              onChange={(e) =>
                                setVForm((f) => ({ ...f, [key]: e.target.value }))
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Business Metrics */}
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        <TrendingUp className="size-4 text-violet-600 dark:text-violet-400" />
                        Business Metrics
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          { key: 'monthlyVisitors' as const, label: 'Monthly Visitors', placeholder: 'e.g. 50000' },
                          { key: 'registeredUsers' as const, label: 'Registered Users', placeholder: 'e.g. 8000' },
                          { key: 'customers' as const, label: 'Customers', placeholder: 'e.g. 500' },
                          { key: 'subscribers' as const, label: 'Subscribers', placeholder: 'e.g. 200' },
                        ].map(({ key, label, placeholder }) => (
                          <div key={key} className="space-y-1.5">
                            <Label htmlFor={`v-${key}`}>{label}</Label>
                            <Input
                              id={`v-${key}`}
                              type="number"
                              placeholder={placeholder}
                              value={vForm[key]}
                              onChange={(e) =>
                                setVForm((f) => ({ ...f, [key]: e.target.value }))
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="v-tech">Technology Stack</Label>
                        <Input
                          id="v-tech"
                          placeholder="e.g. React, Node.js, PostgreSQL"
                          value={vForm.technologyStack}
                          onChange={(e) =>
                            setVForm((f) => ({ ...f, technologyStack: e.target.value }))
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="v-advantage">Competitive Advantage</Label>
                        <Textarea
                          id="v-advantage"
                          placeholder="What makes this business unique?"
                          rows={3}
                          value={vForm.competitiveAdvantage}
                          onChange={(e) =>
                            setVForm((f) => ({ ...f, competitiveAdvantage: e.target.value }))
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="v-growth">Growth Opportunity</Label>
                        <Textarea
                          id="v-growth"
                          placeholder="Describe growth potential and expansion plans..."
                          rows={3}
                          value={vForm.growthOpportunity}
                          onChange={(e) =>
                            setVForm((f) => ({ ...f, growthOpportunity: e.target.value }))
                          }
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      disabled={vLoading || !vForm.projectName.trim()}
                      onClick={handleValuation}
                    >
                      {vLoading ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 size-4" />
                          Get AI Valuation
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* ---- Results ---- */}
              <motion.div variants={itemVariants}>
                <AnimatePresence mode="wait">
                  {vLoading && (
                    <motion.div
                      key="v-loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Card>
                        <CardHeader>
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Skeleton className="h-24 w-full rounded-xl" />
                          <div className="grid grid-cols-2 gap-3">
                            {[...Array(4)].map((_, i) => (
                              <Skeleton key={i} className="h-20 w-full rounded-lg" />
                            ))}
                          </div>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-16 w-full rounded-lg" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {!vLoading && vError && (
                    <motion.div
                      key="v-error"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Card className="border-red-200 dark:border-red-900">
                        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                          <AlertCircle className="size-10 text-red-500" />
                          <p className="text-sm font-medium text-red-600 dark:text-red-400">
                            {vError}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleValuation}
                          >
                            Retry
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {!vLoading && !vError && !vResult && (
                    <motion.div
                      key="v-empty"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                          <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40">
                            <Sparkles className="size-8 text-amber-500" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold">Ready to Valuate</h3>
                            <p className="max-w-xs text-sm text-muted-foreground">
                              Fill in the form and click &quot;Get AI Valuation&quot; to receive a
                              comprehensive business valuation.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {!vLoading && vResult && (
                    <motion.div
                      key="v-result"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {/* Main value */}
                      <Card className="overflow-hidden border-2 border-amber-300/60 dark:border-amber-700/40">
                        <CardContent className="relative p-6 text-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-orange-50 dark:from-amber-950/20 dark:via-transparent dark:to-orange-950/20" />
                          <div className="relative space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">
                              Estimated Value
                            </p>
                            <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                              {formatCurrency(vResult.estimatedValue)}
                            </p>
                            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                              <Star className="size-3.5 fill-amber-400 text-amber-400" />
                              AI-Powered Valuation
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Price breakdown */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold">Price Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              {
                                label: 'Recommended Price',
                                value: vResult.recommendedPrice,
                                color: 'text-emerald-600 dark:text-emerald-400',
                              },
                              {
                                label: 'Investor Price',
                                value: vResult.investorPrice,
                                color: 'text-amber-600 dark:text-amber-400',
                              },
                              {
                                label: 'Wholesale Price',
                                value: vResult.wholesalePrice,
                                color: 'text-violet-600 dark:text-violet-400',
                              },
                              {
                                label: 'Acquisition Price',
                                value: vResult.acquisitionPrice,
                                color: 'text-rose-600 dark:text-rose-400',
                              },
                            ].map((p) => (
                              <div
                                key={p.label}
                                className="rounded-lg border bg-muted/30 p-3"
                              >
                                <p className="text-[11px] font-medium text-muted-foreground">
                                  {p.label}
                                </p>
                                <p className={`mt-1 text-lg font-bold ${p.color}`}>
                                  {formatCurrency(p.value)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Confidence Score */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold">
                            Confidence Score
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Reliability</span>
                            <span className="font-semibold">{vResult.confidenceScore}%</span>
                          </div>
                          <Progress
                            value={vResult.confidenceScore}
                            className="h-3"
                          />
                        </CardContent>
                      </Card>

                      {/* Valuation Details */}
                      {vResult.valuationDetails && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">
                              Valuation Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {vResult.valuationDetails}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Key Factors */}
                      {vResult.keyFactors && vResult.keyFactors.length > 0 && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">Key Factors</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {vResult.keyFactors.map((factor, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="rounded-full px-3 py-1 text-xs"
                                >
                                  {factor}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ================================================================== */}
      {/* Delete Confirmation Dialog                                          */}
      {/* ================================================================== */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action cannot
              be undone and will permanently remove the project and all associated offers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}