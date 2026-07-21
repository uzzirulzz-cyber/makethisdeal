'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Globe, MapPin, TrendingUp, Shield, Zap, ArrowRight, CheckCircle2,
  Star, ExternalLink, MessageSquare, Tag, Target, Users, BarChart3,
  DollarSign, Rocket, ChevronRight, ShoppingCart, Package, Clock,
  Award, Heart, ArrowLeft,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useCurrency } from '@/hooks/use-currency';
import { formatCompact } from '@/lib/currency';
import { getCategoryName } from '@/lib/constants';
import type { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function getFirstLine(text: string | undefined, fallback: string): string {
  if (!text) return fallback;
  const line = text.split('\n')[0].trim();
  return line.length > 120 ? line.slice(0, 117) + '...' : line;
}

function generateTagline(project: Project): string {
  if (project.overview) {
    const first = project.overview.split('\n')[0].trim();
    if (first.length > 10) return first.length > 140 ? first.slice(0, 137) + '...' : first;
  }
  const cat = getCategoryName(project.category);
  const name = project.name;
  const taglines: Record<string, string> = {
    'SaaS': `${name} — Premium SaaS platform ready to scale your business`,
    'AI Solutions': `${name} — Next-gen AI-powered solution for modern enterprises`,
    'E-commerce': `${name} — Your next e-commerce powerhouse, ready to launch`,
    'Real Estate': `${name} — Premium digital real estate with high growth potential`,
    'Mobile Apps': `${name} — Feature-rich mobile app with engaged users`,
    'Startups': `${name} — High-potential startup with proven traction`,
    'FinTech': `${name} — Innovative financial technology platform`,
    'HealthTech': `${name} — Transforming healthcare with technology`,
    'EdTech': `${name} — Education technology for the next generation`,
    'Cybersecurity': `${name} — Enterprise-grade security solutions`,
    'Domains': `${name} — Premium domain name with brand-building potential`,
    'Websites': `${name} — Established website with existing traffic`,
    'Digital Products': `${name} — Ready-to-use digital product with revenue`,
  };
  return taglines[cat] || `${name} — A premium ${cat} opportunity on MakeThisDeal`;
}

function getTags(project: Project): string[] {
  if (project.tags) {
    return project.tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 8);
  }
  const tags: string[] = [];
  if (project.category) tags.push(getCategoryName(project.category));
  if (project.targetMarket) tags.push(project.targetMarket.split(',')[0]?.trim() || 'Global Market');
  if (project.businessStage) tags.push(project.businessStage.charAt(0).toUpperCase() + project.businessStage.slice(1));
  if (project.technologyStack) {
    project.technologyStack.split(',').slice(0, 3).forEach((t) => tags.push(t.trim()));
  }
  return tags.slice(0, 8);
}

interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accent: string;
}

function getFeatureCards(project: Project, fmt: (v?: number) => string): FeatureCard[] {
  const cards: FeatureCard[] = [];

  // 1. Competitive Advantage
  if (project.competitiveAdvantage) {
    const short = project.competitiveAdvantage.split('\n')[0].trim();
    cards.push({
      icon: Shield,
      title: 'Competitive Edge',
      description: short.length > 120 ? short.slice(0, 117) + '...' : short,
      accent: 'from-emerald-500 to-green-600',
    });
  }

  // 2. Growth Opportunity
  if (project.growthOpportunity) {
    const short = project.growthOpportunity.split('\n')[0].trim();
    cards.push({
      icon: TrendingUp,
      title: 'Growth Potential',
      description: short.length > 120 ? short.slice(0, 117) + '...' : short,
      accent: 'from-amber-500 to-yellow-500',
    });
  }

  // 3. Target Market
  if (project.targetMarket) {
    cards.push({
      icon: Target,
      title: 'Target Market',
      description: project.targetMarket.length > 120
        ? project.targetMarket.slice(0, 117) + '...'
        : project.targetMarket,
      accent: 'from-cyan-500 to-sky-500',
    });
  }

  // 4. Revenue / Business Model
  if (project.revenueModel) {
    cards.push({
      icon: BarChart3,
      title: 'Revenue Model',
      description: project.revenueModel.length > 120
        ? project.revenueModel.slice(0, 117) + '...'
        : project.revenueModel,
      accent: 'from-violet-500 to-purple-500',
    });
  }

  // Fallbacks if not enough
  if (cards.length < 4) {
    if (project.monthlyRevenue || project.annualRevenue) {
      cards.push({
        icon: DollarSign,
        title: 'Revenue Generating',
        description: `This listing shows active revenue with ${project.monthlyRevenue ? fmt(project.monthlyRevenue) + '/mo' : fmt(project.annualRevenue) + '/yr'}`,
        accent: 'from-emerald-400 to-teal-500',
      });
    }
  }
  if (cards.length < 4) {
    cards.push({
      icon: Zap,
      title: 'Ready to Transfer',
      description: 'Full documentation and seamless transfer process. Start building from day one.',
      accent: 'from-amber-400 to-orange-500',
    });
  }
  if (cards.length < 4) {
    cards.push({
      icon: Users,
      title: 'Established Presence',
      description: `${project.registeredUsers || project.customers || project.monthlyActiveUsers ? 'Existing user base with proven traction.' : 'Brand-ready digital asset with growth potential.'}`,
      accent: 'from-pink-500 to-rose-500',
    });
  }

  return cards.slice(0, 4);
}

const USE_CASE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  saas: Package, 'ai-solutions': Rocket, ecommerce: ShoppingCart,
  'real-estate': MapPin, 'mobile-apps': Zap, startups: Rocket,
  fintech: DollarSign, healthtech: Heart, edtech: Star,
  cybersecurity: Shield, domains: Globe, websites: ExternalLink,
  'digital-products': Package, manufacturing: Package, retail: ShoppingCart,
  wholesale: Package, investments: BarChart3, 'crm-erp': BarChart3,
};

function getUseCaseIcon(tag: string): React.ComponentType<{ className?: string }> {
  const lower = tag.toLowerCase();
  for (const [key, icon] of Object.entries(USE_CASE_ICONS)) {
    if (lower.includes(key) || lower.includes(key.replace('-', ''))) return icon;
  }
  return Tag;
}

/* ------------------------------------------------------------------ */
/*  Animated section wrapper                                          */
/* ------------------------------------------------------------------ */

function AnimatedSection({
  children,
  className = '',
  delay = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton                                                          */
/* ------------------------------------------------------------------ */

function StorefrontSkeleton() {
  return (
    <div className="min-h-screen bg-[#080f0c]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Skeleton className="h-16 w-full mb-6 rounded-xl" />
        <Skeleton className="h-12 w-full max-w-2xl mx-auto mb-12 rounded-full" />
        <div className="py-24 text-center space-y-4">
          <Skeleton className="h-16 w-96 mx-auto" />
          <Skeleton className="h-6 w-72 mx-auto" />
          <Skeleton className="h-12 w-48 mx-auto mt-8 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl mb-20" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step Number Badge                                                  */
/* ------------------------------------------------------------------ */

function StepBadge({ num }: { num: number }) {
  return (
    <div className="relative flex items-center justify-center size-14 shrink-0">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 opacity-20" />
      <div className="relative size-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
        <span className="text-lg font-bold text-white">{num}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function StorefrontPreview() {
  const { selectedProjectId, setCurrentView, pkrToUsd } = useAppStore();
  const { formatPrice, mode } = useCurrency();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

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
        }
      } catch {
        // Silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProject();
    return () => { cancelled = true; };
  }, [selectedProjectId]);

  if (loading) return <StorefrontSkeleton />;
  if (!project) {
    return (
      <div className="min-h-screen bg-[#080f0c] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white/60">Project not found.</p>
          <Button
            variant="outline"
            className="gap-2 text-white/80 border-white/20 hover:bg-white/10 hover:text-white"
            onClick={() => setCurrentView('browse')}
          >
            <ArrowLeft className="size-4" /> Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const tagline = generateTagline(project);
  const tags = getTags(project);
  const features = getFeatureCards(project, formatPrice);
  const brandName = project.name;
  const category = getCategoryName(project.category);
  const country = project.country || 'Pakistan';

  return (
    <div className="min-h-screen bg-[#080f0c] text-white overflow-x-hidden">
      {/* ============ GRADIENT OVERLAY ============ */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080f0c] via-[#0a1a14] to-[#080f0c]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-emerald-800/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* ============ HEADER ============ */}
        <AnimatedSection>
          <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080f0c]/80 border-b border-white/[0.06]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-white/50 hover:text-white hover:bg-white/10 -ml-2 mr-1"
                    onClick={() => setCurrentView('browse')}
                  >
                    <ArrowLeft className="size-4" />
                    <span className="hidden sm:inline">Marketplace</span>
                  </Button>
                  <Separator orientation="vertical" className="h-6 bg-white/10 mx-1 hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <Globe className="size-4 text-white" />
                    </div>
                    <span className="font-bold text-white text-sm sm:text-base tracking-tight truncate max-w-[160px] sm:max-w-none">
                      {brandName}
                    </span>
                  </div>
                </div>

                {/* Nav links (desktop) */}
                <nav className="hidden md:flex items-center gap-6 text-sm text-white/50">
                  <a href="#use-cases" className="hover:text-white transition-colors">Use Cases</a>
                  <a href="#features" className="hover:text-white transition-colors">Why Choose</a>
                  <a href="#how-to-buy" className="hover:text-white transition-colors">How to Buy</a>
                  <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                </nav>

                {/* CTA */}
                <Button
                  onClick={() => setCurrentView('detail')}
                  className="gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white border-0 shadow-lg shadow-emerald-500/20"
                >
                  <MessageSquare className="size-4" />
                  <span className="hidden sm:inline">Make an Offer</span>
                </Button>
              </div>
            </div>
          </header>
        </AnimatedSection>

        {/* ============ LOCATION / TAGLINE BAR ============ */}
        <AnimatedSection delay={0.1}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
            <div className="inline-flex items-center gap-3 bg-white/[0.06] border border-white/[0.08] rounded-full px-5 py-2.5 backdrop-blur-sm">
              <MapPin className="size-4 text-emerald-400 shrink-0" />
              <span className="text-sm text-white/70">{country}{project.city ? ` • ${project.city}` : ''}</span>
              <Separator orientation="vertical" className="h-4 bg-white/10" />
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs hover:bg-emerald-500/30">
                {category}
              </Badge>
              {project.featured && (
                <>
                  <Separator orientation="vertical" className="h-4 bg-white/10" />
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs hover:bg-amber-500/30 gap-1">
                    <Star className="size-3 fill-current" /> Featured
                  </Badge>
                </>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* ============ HERO SECTION ============ */}
        <AnimatedSection delay={0.15} className="mt-16 sm:mt-24 mb-20 sm:mb-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            {/* Brand name */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-6"
            >
              <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                {brandName}
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {tagline}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => setCurrentView('detail')}
                className="gap-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white border-0 shadow-xl shadow-emerald-500/25 h-12 px-8 text-base font-semibold rounded-full"
              >
                Make an Offer
                <ArrowRight className="size-4" />
              </Button>
              {project.websiteUrl && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.open(project.websiteUrl, '_blank', 'noopener,noreferrer')}
                  className="gap-2.5 border-white/15 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/25 h-12 px-8 text-base font-medium rounded-full bg-white/[0.04]"
                >
                  <ExternalLink className="size-4" />
                  Visit Website
                </Button>
              )}
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-12 text-sm text-white/40"
            >
              {project.monthlyVisitors && (
                <span className="flex items-center gap-1.5">
                  <Globe className="size-3.5 text-emerald-500" />
                  {project.monthlyVisitors.toLocaleString()} monthly visitors
                </span>
              )}
              {project.registeredUsers && (
                <span className="flex items-center gap-1.5">
                  <Users className="size-3.5 text-emerald-500" />
                  {project.registeredUsers.toLocaleString()} users
                </span>
              )}
              {project.annualRevenue && (
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="size-3.5 text-emerald-500" />
                  {formatPrice(project.annualRevenue)} revenue
                </span>
              )}
              {project.expectedROI && (
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 text-emerald-500" />
                  {project.expectedROI}% expected ROI
                </span>
              )}
            </motion.div>
          </div>
        </AnimatedSection>

        {/* ============ USE CASES / CATEGORY CARDS ============ */}
        <AnimatedSection id="use-cases" delay={0.1} className="mb-20 sm:mb-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 mb-4 text-xs uppercase tracking-widest">
                <Tag className="size-3 mr-1.5" /> Use Cases
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Perfect For
              </h2>
              <p className="text-white/40 max-w-lg mx-auto">
                This {category.toLowerCase()} listing is ideal for a wide range of applications
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {tags.map((tag, i) => {
                const Icon = getUseCaseIcon(tag);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <Card className="group relative overflow-hidden bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all duration-300 cursor-default h-full">
                      <CardContent className="p-4 sm:p-5 flex flex-col items-center text-center gap-3">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-green-600/30 transition-colors">
                          <Icon className="size-5 text-emerald-400" />
                        </div>
                        <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors leading-tight">
                          {tag}
                        </span>
                      </CardContent>
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/5 group-hover:to-green-500/5 transition-all pointer-events-none" />
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* ============ WHY CHOOSE / FEATURE CARDS ============ */}
        <AnimatedSection id="features" delay={0.1} className="mb-20 sm:mb-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/25 mb-4 text-xs uppercase tracking-widest">
                <Award className="size-3 mr-1.5" /> Why Choose
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                What Makes This Special
              </h2>
              <p className="text-white/40 max-w-lg mx-auto">
                Key advantages and opportunities with this listing
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <Card className="group relative overflow-hidden bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.15] transition-all duration-300 h-full">
                      <CardContent className="p-6 flex flex-col gap-4">
                        <div className={`size-12 rounded-2xl bg-gradient-to-br ${feature.accent} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg`}>
                          <Icon className="size-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-white mb-1.5">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-white/45 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* ============ HOW TO BUY ============ */}
        <AnimatedSection id="how-to-buy" delay={0.1} className="mb-20 sm:mb-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/25 mb-4 text-xs uppercase tracking-widest">
                <Rocket className="size-3 mr-1.5" /> Process
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                How to Buy
              </h2>
              <p className="text-white/40 max-w-lg mx-auto">
                Three simple steps to acquire this listing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-7 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-emerald-500/30 via-white/10 to-emerald-500/30" />

              {[
                {
                  num: 1,
                  icon: MessageSquare,
                  title: 'Browse & Inquire',
                  desc: 'Review the listing details, explore the demo site, and send your initial inquiry through our secure messaging system.',
                },
                {
                  num: 2,
                  icon: CheckCircle2,
                  title: 'Negotiate & Agree',
                  desc: 'Discuss terms, make your offer, and negotiate a fair price with the seller through our escrow-protected platform.',
                },
                {
                  num: 3,
                  icon: Zap,
                  title: 'Transfer & Launch',
                  desc: 'Complete the secure transfer of assets, domain, and source code. Launch your new venture with full seller support.',
                },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    className="relative"
                  >
                    <Card className="bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07] hover:border-emerald-500/20 transition-all duration-300 text-center h-full">
                      <CardContent className="p-6 sm:p-8 flex flex-col items-center gap-4">
                        <StepBadge num={step.num} />
                        <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                          <Icon className="size-6 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                          <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
                        </div>
                        {i < 2 && (
                          <ChevronRight className="size-5 text-white/20 hidden md:block absolute -right-4 top-8 z-10" />
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* ============ PRICING SECTION ============ */}
        <AnimatedSection id="pricing" delay={0.1} className="mb-20 sm:mb-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Card className="relative overflow-hidden bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-white/[0.1]">
              {/* Glow effect */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

              <CardContent className="relative p-8 sm:p-12 text-center">
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 mb-6 text-xs uppercase tracking-widest">
                  <DollarSign className="size-3 mr-1.5" /> Pricing
                </Badge>

                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Investment Overview
                </h2>
                <p className="text-white/40 mb-10 max-w-md mx-auto">
                  Transparent pricing with no hidden fees. Secure your next venture today.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto mb-10">
                  {/* Suggested Price */}
                  <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/[0.06]">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
                      Asking Price
                    </p>
                    {project.suggestedSellingPrice ? (
                      <>
                        <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                          {formatPrice(project.suggestedSellingPrice)}
                        </p>
                        <p className="text-sm text-emerald-400 font-medium">
                          ≈ {formatCompact(project.suggestedSellingPrice, mode === 'PKR' ? 'USD' : 'PKR', pkrToUsd)}
                        </p>
                      </>
                    ) : (
                      <p className="text-xl text-white/30">Contact for Price</p>
                    )}
                  </div>

                  {/* Buy Now */}
                  {project.buyNowPrice && (
                    <div className="bg-white/[0.04] rounded-2xl p-6 border border-emerald-500/20 relative overflow-hidden">
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] px-2">
                          Instant
                        </Badge>
                      </div>
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
                        Buy Now
                      </p>
                      <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                        {formatPrice(project.buyNowPrice)}
                      </p>
                      <p className="text-sm text-emerald-400 font-medium">
                        ≈ {formatCompact(project.buyNowPrice, mode === 'PKR' ? 'USD' : 'PKR', pkrToUsd)}
                      </p>
                    </div>
                  )}

                  {/* Minimum Offer */}
                  {project.minimumOffer && (
                    <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/[0.06]">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
                        Minimum Offer
                      </p>
                      <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                        {formatPrice(project.minimumOffer)}
                      </p>
                      <p className="text-sm text-white/40 font-medium">
                        ≈ {formatCompact(project.minimumOffer, mode === 'PKR' ? 'USD' : 'PKR', pkrToUsd)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional pricing info */}
                {project.aiValuation && (
                  <p className="text-sm text-white/30 mb-8">
                    AI Valuation: <span className="text-white/50 font-medium">{formatPrice(project.aiValuation)}</span>
                    {project.expectedROI && (
                      <> • Expected ROI: <span className="text-emerald-400 font-medium">{project.expectedROI}%</span></>
                    )}
                  </p>
                )}

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={() => setCurrentView('detail')}
                    className="gap-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white border-0 shadow-xl shadow-emerald-500/25 h-13 px-10 text-base font-semibold rounded-full"
                  >
                    <MessageSquare className="size-5" />
                    Make an Offer
                    <ArrowRight className="size-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2.5 border-white/15 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/25 h-13 px-8 text-base rounded-full bg-white/[0.03]"
                    onClick={() => setCurrentView('detail')}
                  >
                    <Heart className="size-4" />
                    Save & Review Later
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-10 text-xs text-white/30">
                  <span className="flex items-center gap-1.5">
                    <Shield className="size-3.5 text-emerald-500/60" /> Secure Transactions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-emerald-500/60" /> Fast Transfer
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-emerald-500/60" /> Verified Listing
                  </span>
                  {project.seller?.verified && (
                    <span className="flex items-center gap-1.5">
                      <Award className="size-3.5 text-emerald-500/60" /> Verified Seller
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>

        {/* ============ FOOTER ============ */}
        <AnimatedSection delay={0.05}>
          <footer className="border-t border-white/[0.06]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <Globe className="size-4 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm">MakeThisDeal</span>
                    <span className="text-white/30 text-xs ml-2">Buy & Sell Businesses</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/30">
                  <span>Powered by</span>
                  <span className="text-emerald-400 font-medium">MakeThisDeal</span>
                  <span>•</span>
                  <span>Secure Marketplace</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-white/40 hover:text-white hover:bg-white/10 text-xs"
                  onClick={() => setCurrentView('browse')}
                >
                  <ArrowLeft className="size-3" />
                  Back to Marketplace
                </Button>
              </div>
            </div>
          </footer>
        </AnimatedSection>
      </div>
    </div>
  );
}