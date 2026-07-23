'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, PlusCircle, Briefcase, Globe, CircleDollarSign, HandCoins } from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useCurrency } from '@/hooks/use-currency';
import { formatCompact } from '@/lib/currency';

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

const PORTFOLIO_PKR = 12_300_000;


export default function HeroSection() {
  const setCurrentView = useAppStore((s) => s.setCurrentView);
  const pkrToUsd = useAppStore((s) => s.pkrToUsd);
  const { formatPrice, mode } = useCurrency();

  const secondaryMode = mode === 'PKR' ? 'USD' : 'PKR';
  const secondaryValue = pkrToUsd ? formatCompact(PORTFOLIO_PKR, secondaryMode, pkrToUsd) : '';

  const statsItems = [
    { label: 'Portfolio Value', value: formatPrice(PORTFOLIO_PKR), icon: CircleDollarSign },
    { label: 'Listings', value: '12', icon: Briefcase },
    { label: mode === 'PKR' ? 'US$ Equivalent' : 'PKR Equivalent', value: secondaryValue, icon: Globe },
    { label: 'Categories', value: '6', icon: HandCoins },
  ];

  return (
    <section className="relative bg-white overflow-hidden py-16 sm:py-24 lg:py-32">
      {/* Subtle decorative gradient orbs (very faint) */}
      <div
        className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="mb-6">
            <Image
              src="/logo-mtd.png"
              alt="MakeThisDeal Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="max-w-4xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl text-[#0D0C22]"
          >
            <span className="gradient-text">Buy, Sell &amp; Invest</span> in Businesses Worldwide
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-[#6E6E80]"
          >
            The global enterprise marketplace for SaaS, Real Estate, Startups,
            E-commerce, AI Solutions, and 50+ business categories
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <button
              className="f5-btn-primary inline-flex h-12 items-center gap-2 px-8 text-base font-semibold sm:h-14 sm:px-10 sm:text-lg"
              onClick={() => setCurrentView('browse')}
            >
              <ArrowRight className="size-5" />
              Explore Projects
            </button>
            <button
              className="f5-btn-secondary inline-flex h-12 items-center gap-2 px-8 text-base font-semibold sm:h-14 sm:px-10 sm:text-lg"
              onClick={() => setCurrentView('create')}
            >
              <PlusCircle className="size-5" />
              List Your Business
            </button>
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
                    <Icon className="size-4 text-[#4F46E5]" />
                    <span
                      className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl text-[#0D0C22]"
                    >
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-[#A0A0B0]">
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
