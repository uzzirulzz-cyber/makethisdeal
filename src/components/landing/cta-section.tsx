'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/use-app-store';

export default function CtaSection() {
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  return (
    <section className="bg-primary/5 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Ready to Make a Deal?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Join thousands of businesses and investors on the world&apos;s most
            comprehensive enterprise marketplace
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              className="h-12 px-8 text-base font-semibold sm:h-14 sm:px-10 sm:text-lg"
              onClick={() => setCurrentView('auth')}
            >
              <ArrowRight className="size-5" />
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base font-semibold sm:h-14 sm:px-10 sm:text-lg"
              onClick={() => setCurrentView('auth')}
            >
              <Phone className="size-5" />
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}