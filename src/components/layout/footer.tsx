'use client';

import { useAppStore } from '@/store/use-app-store';
import {
  Globe, Mail, MapPin,
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
    <footer className="f5-footer mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg font-bold text-sm text-white"
                style={{ backgroundColor: '#8A2BE2' }}
              >
                MTD
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Make<span style={{ color: '#C084FC' }}>This</span>Deal
              </span>
            </div>
            <p className="text-sm mb-5 max-w-xs" style={{ color: '#A1A1AA' }}>
              The global enterprise marketplace where businesses connect, invest, and grow together.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-5">
              <a
                href="mailto:playbeatdigital@proton.me"
                className="flex items-center gap-2.5 text-sm transition-colors group"
                style={{ color: '#A1A1AA' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#C084FC';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#A1A1AA';
                }}
              >
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'rgba(138, 43, 226, 0.15)' }}
                >
                  <Mail className="h-4 w-4" style={{ color: '#C084FC' }} />
                </div>
                <span className="truncate">playbeatdigital@proton.me</span>
              </a>
              <a
                href="https://wa.me/923318333368"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm transition-colors group"
                style={{ color: '#A1A1AA' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#34D399';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#A1A1AA';
                }}
              >
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
                >
                  <MessageCircle className="h-4 w-4" style={{ color: '#34D399' }} />
                </div>
                <span>+92 331 8333368</span>
              </a>
              <div
                className="flex items-center gap-2.5 text-sm"
                style={{ color: '#A1A1AA' }}
              >
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <MapPin className="h-4 w-4" style={{ color: '#A1A1AA' }} />
                </div>
                <span>Karachi, Pakistan</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[Twitter, Linkedin, Github, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#A1A1AA' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(138, 43, 226, 0.15)';
                    (e.currentTarget as HTMLElement).style.color = '#C084FC';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    (e.currentTarget as HTMLElement).style.color = '#A1A1AA';
                  }}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4 text-white tracking-tight">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => setCurrentView(link.action)}
                      className="text-sm transition-colors duration-200"
                      style={{ color: '#A1A1AA' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#C084FC';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#A1A1AA';
                      }}
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
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid #222222' }}
        >
          <p className="text-sm" style={{ color: '#A1A1AA' }}>
            © {new Date().getFullYear()} MakeThisDeal. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:playbeatdigital@proton.me"
              className="text-sm flex items-center gap-1.5 transition-colors duration-200"
              style={{ color: '#A1A1AA' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#C084FC';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#A1A1AA';
              }}
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">playbeatdigital@proton.me</span>
            </a>
            <a
              href="https://wa.me/923318333368"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-1.5 transition-colors duration-200"
              style={{ color: '#34D399' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#6EE7B7';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#34D399';
              }}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
          <p className="text-sm flex items-center gap-1" style={{ color: '#A1A1AA' }}>
            <Globe className="h-3.5 w-3.5" />
            Trusted by businesses in 120+ countries
          </p>
        </div>
      </div>
    </footer>
  );
}
