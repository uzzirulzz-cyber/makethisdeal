'use client';

import { motion } from 'framer-motion';
import { UserPlus, Search, MessageSquare, Handshake } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: 'Create Your Account',
    description:
      'Register and verify your identity to start exploring business opportunities worldwide.',
  },
  {
    number: 2,
    icon: Search,
    title: 'List or Browse',
    description:
      'Publish your projects for sale or explore thousands of verified business listings.',
  },
  {
    number: 3,
    icon: MessageSquare,
    title: 'Connect & Negotiate',
    description:
      'Chat directly with buyers and sellers, ask questions, and make competitive offers.',
  },
  {
    number: 4,
    icon: Handshake,
    title: 'Close the Deal',
    description:
      'Sign contracts, process secure payments, and transfer assets with full support.',
  },
];

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

const stepVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function HowItWorksSection() {
  return (
    <section className="bg-[#F8F9FA] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="f5-section-heading text-2xl font-bold tracking-tight text-[#0D0C22] sm:text-3xl lg:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-[#6E6E80] sm:text-lg">
            Get started in four simple steps
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative"
        >
          {/* Connector line (horizontal on desktop, vertical on mobile) */}
          <div
            className="absolute left-6 top-0 hidden h-full w-px bg-[#4F46E5]/20 md:left-1/2 md:block md:h-px md:w-[calc(100%-3rem)] md:-translate-x-1/2"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={stepVariants}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
                    <div className="flex flex-col items-center gap-4 p-6 text-center">
                      {/* Step number badge */}
                      <div className="relative">
                        <div className="absolute -inset-1.5 rounded-full bg-[#4F46E5]/10" />
                        <div className="relative flex size-14 items-center justify-center rounded-full bg-[#4F46E5] text-lg font-bold text-white">
                          {step.number}
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="flex size-11 items-center justify-center rounded-xl bg-[#4F46E5]/10">
                        <Icon className="size-5 text-[#4F46E5]" />
                      </div>

                      {/* Text */}
                      <div>
                        <h3 className="text-base font-semibold text-[#0D0C22]">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#6E6E80]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Arrow between steps on mobile (vertical) */}
                  <div className="absolute -bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center md:hidden">
                    <div className="flex size-6 items-center justify-center rounded-full bg-white shadow-sm">
                      <svg
                        className="size-3 text-[#4F46E5]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Arrow between steps on desktop (horizontal) */}
                  <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 md:flex">
                    <div className="flex size-6 items-center justify-center rounded-full bg-white shadow-sm">
                      <svg
                        className="size-3 text-[#4F46E5]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
