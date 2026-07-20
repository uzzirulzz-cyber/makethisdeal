'use client';

import { useAppStore } from '@/store/use-app-store';
import {
  Globe, Mail, Phone, MapPin,
  Twitter, Linkedin, Github, Youtube, MessageCircle
} from 'lucide-react';

const footerLinks = {
  'Marketplace': [
    { label: 'Browse All Projects', action: 'browse' as const },
    { label: 'Featured Listings', action: 'browse' as const },
    { label: 'Categories', action: 'browse' as const },
    { label: 'AI Valuation', action: 'create' as const },
  ],
  'Solutions': [
    { label: 'For Sellers', action: 'create' as const },
    { label: 'For Investors', action: 'browse' as const },
    { label: 'For Brokers', action: 'browse' as const },
    { label: 'Enterprise', action: 'browse' as const },
  ],
  'Company': [
    { label: 'About Us', action: 'landing' as const },
    { label: 'How It Works', action: 'landing' as const },
    { label: 'Pricing', action: 'landing' as const },
    { label: 'Contact', action: 'landing' as const },
  ],
  'Legal': [
    { label: 'Privacy Policy', action: 'landing' as const },
    { label: 'Terms of Service', action: 'landing' as const },
    { label: 'Cookie Policy', action: 'landing' as const },
    { label: 'Compliance', action: 'landing' as const },
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
            <p className="text-sm text-muted-foreground mb-5 max-w-xs">
              The global enterprise marketplace where businesses connect, invest, and grow together.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-5">
              <a
                href="mailto:playbeatdigital@proton.me"
                className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="truncate">playbeatdigital@proton.me</span>
              </a>
              <a
                href="https://wa.me/923318333368"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <MessageCircle className="h-4 w-4 text-emerald-500" />
                </div>
                <span>+92 331 8333368</span>
              </a>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Karachi, Pakistan</span>
              </div>
            </div>

            {/* Social Icons */}
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
                      onClick={() => setCurrentView(link.action)}
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
          <div className="flex items-center gap-4">
            <a
              href="mailto:playbeatdigital@proton.me"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">playbeatdigital@proton.me</span>
            </a>
            <a
              href="https://wa.me/923318333368"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" />
            Trusted by businesses in 120+ countries
          </p>
        </div>
      </div>
    </footer>
  );
}