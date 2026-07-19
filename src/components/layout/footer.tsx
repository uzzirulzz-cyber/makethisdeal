'use client';

import { useAppStore } from '@/store/use-app-store';
import {
  Globe, Mail, Phone, MapPin, ArrowRight,
  Twitter, Linkedin, Github, Youtube
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { CATEGORY_ICONS } from '@/lib/constants';
import Link from 'next/link';

const footerLinks = {
  'Marketplace': [
    { label: 'Browse All Projects', action: 'browse' },
    { label: 'Featured Listings', action: 'browse' },
    { label: 'Categories', action: 'browse' },
    { label: 'AI Valuation', action: 'create' },
  ],
  'Solutions': [
    { label: 'For Sellers', action: 'create' },
    { label: 'For Investors', action: 'browse' },
    { label: 'For Brokers', action: 'browse' },
    { label: 'Enterprise', action: 'browse' },
  ],
  'Company': [
    { label: 'About Us', action: 'landing' },
    { label: 'How It Works', action: 'landing' },
    { label: 'Pricing', action: 'landing' },
    { label: 'Contact', action: 'landing' },
  ],
  'Legal': [
    { label: 'Privacy Policy', action: 'landing' },
    { label: 'Terms of Service', action: 'landing' },
    { label: 'Cookie Policy', action: 'landing' },
    { label: 'Compliance', action: 'landing' },
  ],
};

export function Footer() {
  const { setCurrentView } = useAppStore();

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                MTD
              </div>
              <span className="text-lg font-bold tracking-tight">
                Make<span className="text-primary">This</span>Deal
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              The global enterprise marketplace where businesses connect, invest, and grow together.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Linkedin, Github, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="h-9 w-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => {
                        if (link.action === 'browse') setCurrentView('browse');
                        else if (link.action === 'create') setCurrentView('create');
                      }}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MakeThisDeal. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" />
            Trusted by businesses in 120+ countries
          </p>
        </div>
      </div>
    </footer>
  );
}