'use client';

import { motion } from 'framer-motion';
import { STATS } from '@/lib/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function StatsSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="f5-section-heading">Platform Highlights</h2>
          <p className="mt-3 text-muted-foreground sm:text-lg">
            Key metrics that define our marketplace
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} variants={cardVariants}>
                <div className="f5-card flex flex-col items-center py-6 text-center">
                  <div
                    className="mb-3 flex size-12 items-center justify-center rounded-xl"
                    style={{ background: 'rgba(138, 43, 226, 0.1)' }}
                  >
                    <Icon className="size-6" style={{ color: '#8A2BE2' }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tracking-tight text-[#333333] sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}