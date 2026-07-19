'use client';

import { motion } from 'framer-motion';
import { STATS } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';

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
                <Card className="border-0 bg-secondary/40 shadow-none transition-colors hover:bg-secondary/70">
                  <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}