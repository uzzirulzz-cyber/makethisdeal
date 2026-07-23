'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';

export default function CtaSection() {
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  return (
    <section className="f5-cta-section py-16 sm:py-20 overflow-hidden">
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #8A2BE2 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Ready to <span className="gradient-text">Make a Deal?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg" style={{ color: '#A1A1AA' }}>
            Join thousands of businesses and investors on the world&apos;s most
            comprehensive enterprise marketplace
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button
              className="f5-btn-white inline-flex h-12 items-center gap-2 px-8 text-base font-semibold sm:h-14 sm:px-10 sm:text-lg"
              onClick={() => setCurrentView('browse')}
            >
              <ArrowRight className="size-5" />
              Get Started Free
            </button>
            <button
              className="inline-flex h-12 items-center gap-2 px-8 text-base font-semibold sm:h-14 sm:px-10 sm:text-lg border border-[#333333] text-white rounded-full bg-transparent hover:border-[#C084FC] hover:text-[#C084FC] transition-all duration-200"
              onClick={() => setCurrentView('landing')}
            >
              <Phone className="size-5" />
              Contact Sales
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}