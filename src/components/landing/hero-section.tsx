'use client';

import { motion } from 'framer-motion';
import { ArrowRight, PlusCircle, Briefcase, Globe, CircleDollarSign, HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/use-app-store';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const statsItems = [
  { label: 'Projects', value: '12,500+', icon: Briefcase },
  { label: 'Users', value: '85,000+', icon: Globe },
  { label: 'Deals', value: '$2.4B+', icon: CircleDollarSign },
  { label: 'Countries', value: '120+', icon: HandCoins },
];

export default function HeroSection() {
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  return (
    <section className="relative hero-gradient overflow-hidden">
      {/* Subtle dot pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle, oklch(0.45 0.15 160) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="gradient-text max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Buy, Sell &amp; Invest in Businesses Worldwide
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl"
          >
            The global enterprise marketplace for SaaS, Real Estate, Startups,
            E-commerce, AI Solutions, and 50+ business categories
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <Button
              size="lg"
              className="h-12 px-8 text-base font-semibold sm:h-14 sm:px-10 sm:text-lg"
              onClick={() => setCurrentView('browse')}
            >
              <ArrowRight className="size-5" />
              Explore Projects
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base font-semibold sm:h-14 sm:px-10 sm:text-lg"
              onClick={() => setCurrentView('create')}
            >
              <PlusCircle className="size-5" />
              List Your Business
            </Button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4"
          >
            {statsItems.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-primary" />
                    <span className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}