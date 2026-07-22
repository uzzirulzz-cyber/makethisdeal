'use client';

import { useState } from 'react';
import {
  Mail, Send, User, MessageSquare, Tag, CheckCircle2,
  Clock, MessageCircle, HelpCircle, Briefcase, Handshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'general', label: 'General Inquiry', icon: MessageCircle, color: '#6D9BD3' },
  { value: 'support', label: 'Technical Support', icon: HelpCircle, color: '#9059E1' },
  { value: 'partnership', label: 'Partnership', icon: Handshake, color: '#34D399' },
  { value: 'listing', label: 'List a Business', icon: Briefcase, color: '#FBBF24' },
];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        toast.success('Message sent successfully!', {
          description: 'We\'ll get back to you within 24 hours.',
        });
      } else {
        toast.error(data.error || 'Failed to send message.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', subject: '', message: '', category: 'general' });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <section className="py-16 sm:py-20 bg-[#F0F4F8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto text-center">
            <div
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
              style={{ background: 'rgba(52, 211, 153, 0.1)' }}
            >
              <CheckCircle2 className="h-10 w-10" style={{ color: '#34D399' }} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#26324E' }}>
              Message Sent!
            </h2>
            <p className="text-base mb-2" style={{ color: '#4A5568' }}>
              Thank you for reaching out, <strong>{formData.name}</strong>.
            </p>
            <p className="text-sm mb-8" style={{ color: '#9BA1B9' }}>
              We&apos;ve received your message and will respond within 24 hours.
              A confirmation has been sent to <strong>{formData.email}</strong>.
            </p>
            <div
              className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full"
              style={{ background: 'rgba(144, 89, 225, 0.08)', color: '#9059E1' }}
            >
              <Clock className="h-4 w-4" />
              Expected response: Within 24 hours
            </div>
            <div className="mt-8">
              <Button
                onClick={handleReset}
                className="btn-secondary gap-2 rounded-xl"
              >
                <MessageSquare className="h-4 w-4" />
                Send Another Message
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-16 sm:py-20 bg-[#F0F4F8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(144, 89, 225, 0.08)', color: '#9059E1' }}
          >
            <Mail className="h-4 w-4" />
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#26324E' }}>
            Have a Question?{' '}
            <span className="gradient-text">We&apos;d Love to Hear</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#4A5568' }}>
            Whether you&apos;re looking to buy, sell, or partner — our team is ready to help
            you make the right deal.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Email Card */}
            <div
              className="surface-card p-5 flex items-start gap-4"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'rgba(144, 89, 225, 0.1)' }}
              >
                <Mail className="h-5 w-5" style={{ color: '#9059E1' }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: '#26324E' }}>Email Us</h3>
                <a
                  href="mailto:playbeatdigital@proton.me"
                  className="text-sm transition-colors duration-200"
                  style={{ color: '#9059E1' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#7C3AED'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#9059E1'; }}
                >
                  playbeatdigital@proton.me
                </a>
                <p className="text-xs mt-1" style={{ color: '#9BA1B9' }}>
                  Response within 24 hours
                </p>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="surface-card p-5 flex items-start gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'rgba(52, 211, 153, 0.1)' }}
              >
                <MessageCircle className="h-5 w-5" style={{ color: '#34D399' }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: '#26324E' }}>WhatsApp</h3>
                <a
                  href="https://wa.me/923318333368"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors duration-200"
                  style={{ color: '#34D399' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#6EE7B7'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#34D399'; }}
                >
                  +92 331 8333368
                </a>
                <p className="text-xs mt-1" style={{ color: '#9BA1B9' }}>
                  Quick replies during business hours
                </p>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="surface-card p-5 flex items-start gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'rgba(109, 155, 211, 0.1)' }}
              >
                <Clock className="h-5 w-5" style={{ color: '#6D9BD3' }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: '#26324E' }}>Business Hours</h3>
                <p className="text-sm" style={{ color: '#4A5568' }}>Mon – Sat: 9 AM – 9 PM (PKT)</p>
                <p className="text-xs mt-1" style={{ color: '#9BA1B9' }}>
                  UTC+5 — Islamabad / Karachi
                </p>
              </div>
            </div>

            {/* Category Quick Links */}
            <div className="surface-card p-5">
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#26324E' }}>
                Quick Topics
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setFormData((p) => ({ ...p, category: cat.value, subject: cat.label }))}
                      className="flex items-center gap-2 text-xs p-2.5 rounded-lg transition-all duration-200 text-left"
                      style={{
                        background: formData.category === cat.value
                          ? 'rgba(144, 89, 225, 0.08)'
                          : 'transparent',
                        border: `1px solid ${formData.category === cat.value ? 'rgba(144, 89, 225, 0.25)' : 'transparent'}`,
                        color: formData.category === cat.value ? '#9059E1' : '#4A5568',
                      }}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: cat.color }} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="surface-card p-6 sm:p-8">
              <h3 className="text-lg font-semibold mb-6" style={{ color: '#26324E' }}>
                Send Us a Message
              </h3>

              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#4A5568' }}>
                    Full Name <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#9BA1B9' }} />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full text-sm focus:outline-none transition-all"
                      style={{
                        padding: '11px 14px 11px 38px',
                        borderRadius: '10px',
                        background: '#F0F4F8',
                        border: '1px solid #DAE2EC',
                        color: '#26324E',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#9059E1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(144,89,225,0.1)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#DAE2EC'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#4A5568' }}>
                    Email Address <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#9BA1B9' }} />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className="w-full text-sm focus:outline-none transition-all"
                      style={{
                        padding: '11px 14px 11px 38px',
                        borderRadius: '10px',
                        background: '#F0F4F8',
                        border: '1px solid #DAE2EC',
                        color: '#26324E',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#9059E1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(144,89,225,0.1)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#DAE2EC'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-5">
                <label className="block text-xs font-medium mb-2" style={{ color: '#4A5568' }}>
                  Subject
                </label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#9BA1B9' }} />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full text-sm focus:outline-none transition-all"
                    style={{
                      padding: '11px 14px 11px 38px',
                      borderRadius: '10px',
                      background: '#F0F4F8',
                      border: '1px solid #DAE2EC',
                      color: '#26324E',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#9059E1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(144,89,225,0.1)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#DAE2EC'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-5">
                <label className="block text-xs font-medium mb-2" style={{ color: '#4A5568' }}>
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full text-sm focus:outline-none transition-all appearance-none cursor-pointer"
                    style={{
                      padding: '11px 40px 11px 14px',
                      borderRadius: '10px',
                      background: '#F0F4F8',
                      border: '1px solid #DAE2EC',
                      color: '#26324E',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#9059E1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(144,89,225,0.1)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#DAE2EC'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9BA1B9' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-xs font-medium mb-2" style={{ color: '#4A5568' }}>
                  Message <span style={{ color: '#F87171' }}>*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your business needs, questions, or how we can help..."
                  className="w-full text-sm focus:outline-none transition-all resize-none"
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: '#F0F4F8',
                    border: '1px solid #DAE2EC',
                    color: '#26324E',
                    minHeight: '120px',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#9059E1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(144,89,225,0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#DAE2EC'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary gap-2 rounded-xl w-full sm:w-auto text-sm font-semibold"
                  style={{
                    height: '46px',
                    paddingLeft: '28px',
                    paddingRight: '28px',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div
                        className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
                <p className="text-xs" style={{ color: '#9BA1B9' }}>
                  By submitting, you agree to our privacy policy. We&apos;ll never share your info.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}