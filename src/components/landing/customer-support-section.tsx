'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, MessageCircle, Clock, Send, CheckCircle2,
  Phone, Globe, MapPin, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/use-app-store';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

const contactChannels = [
  {
    icon: Mail,
    title: 'Email Support',
    subtitle: 'playbeatdigital@proton.me',
    description: 'Get a detailed response within 24 hours. Best for complex inquiries, partnership proposals, and project discussions.',
    action: 'mailto:playbeatdigital@proton.me',
    actionLabel: 'Send Email',
    accent: 'bg-[#4F46E5]/10 text-[#4F46E5]',
    border: 'border-[#4F46E5]/20',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    subtitle: '+92 331 8333368',
    description: 'Quick real-time support. Available for urgent queries, deal negotiations, and instant communication.',
    action: 'https://wa.me/923318333368',
    actionLabel: 'Chat Now',
    accent: 'bg-[#10B981]/10 text-[#10B981]',
    border: 'border-[#10B981]/20',
  },
  {
    icon: Clock,
    title: 'Response Time',
    subtitle: 'Within 24 Hours',
    description: 'We typically respond within a few hours during business days. Weekend inquiries are handled on Monday.',
    action: null,
    actionLabel: null,
    accent: 'bg-[#F59E0B]/10 text-[#F59E0B]',
    border: 'border-[#F59E0B]/20',
  },
];

export default function CustomerSupportSection() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSending(true);
    try {
      // Open mailto with form data
      const subject = encodeURIComponent(formData.subject || 'Inquiry from MakeThisDeal');
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
      );
      window.open(`mailto:playbeatdigital@proton.me?subject=${subject}&body=${body}`);
      setSent(true);
      toast.success('Email client opened! Your message is ready to send.');
      setTimeout(() => {
        setSent(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    } catch {
      toast.error('Could not open email client. Please email us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="relative py-20 sm:py-28 bg-white overflow-hidden">
      {/* Background decorations */}
      <div className="f5-light-blob" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5]/10 px-4 py-1.5 text-sm font-medium text-[#4F46E5] mb-4">
              <Phone className="h-4 w-4" />
              Customer Support
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[#0D0C22]">
              Get in{' '}
              <span className="gradient-text">Touch With Us</span>
            </h2>
            <p className="mt-4 text-[#6E6E80] text-base sm:text-lg max-w-2xl mx-auto">
              Have questions about a listing? Want to discuss a deal? Need help with the platform?
              We&apos;re here to help you every step of the way.
            </p>
          </motion.div>

          {/* Contact Channels */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {contactChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div
                  key={channel.title}
                  className={`relative rounded-2xl border bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${channel.border}`}
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${channel.accent} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0D0C22] mb-1">{channel.title}</h3>
                  <p className="text-[#4F46E5] font-medium text-sm mb-2">{channel.subtitle}</p>
                  <p className="text-sm text-[#6E6E80] leading-relaxed">{channel.description}</p>
                  {channel.action && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 gap-2 rounded-full"
                      onClick={() => {
                        if (channel.action?.startsWith('http')) {
                          window.open(channel.action, '_blank');
                        } else {
                          window.location.href = channel.action!;
                        }
                      }}
                    >
                      {channel.actionLabel}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants} className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center">
                  <Send className="h-5 w-5 text-[#4F46E5]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0D0C22]">Send us a Message</h3>
                  <p className="text-sm text-[#A0A0B0]">We&apos;ll get back to you within 24 hours</p>
                </div>
              </div>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="h-16 w-16 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-[#10B981]" />
                  </div>
                  <p className="text-lg font-semibold text-[#10B981]">
                    Email Client Opened!
                  </p>
                  <p className="text-sm text-[#6E6E80] text-center">
                    Your email client should have opened with the pre-filled message. If not, email us directly at{' '}
                    <a href="mailto:playbeatdigital@proton.me" className="text-[#4F46E5] hover:underline font-medium">
                      playbeatdigital@proton.me
                    </a>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block text-[#0D0C22]">
                        Name <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="h-10 w-full rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
                        style={{ border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#0D0C22' }}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block text-[#0D0C22]">
                        Email <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block text-[#0D0C22]">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What's this about?"
                      className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block text-[#0D0C22]">
                      Message <span className="text-[#EF4444]">*</span>
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your inquiry, project interest, or any questions..."
                      rows={4}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all resize-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={sending}
                      className="w-full sm:w-auto gap-2 h-11 px-8 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white border-0"
                    >
                      {sending ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Send Message
                    </Button>
                    <p className="text-xs text-[#A0A0B0]">
                      Or email directly:{' '}
                      <a
                        href="mailto:playbeatdigital@proton.me"
                        className="text-[#4F46E5] hover:underline font-medium"
                      >
                        playbeatdigital@proton.me
                      </a>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

          {/* Quick info bar */}
          <motion.div variants={itemVariants} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[#A0A0B0]">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Based in Karachi, Pakistan</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-[#E5E7EB]" />
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Serving clients worldwide</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-[#E5E7EB]" />
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Response within 24h</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
