'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Mail, X, Send, User, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function FloatingEmailButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, category: 'quick' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        toast.success('Message sent!');
      } else {
        toast.error(data.error || 'Failed to send.');
      }
    } catch {
      toast.error('Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setFormData({ name: '', email: '', message: '' });
    setSubmitted(false);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" ref={panelRef}>
      {isOpen && (
        <div
          className="w-[340px] sm:w-[380px] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: '#FFFFFF',
            border: '1px solid #DAE2EC',
            animation: 'fabSlideIn 0.25s ease-out',
          }}
        >
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #26324E, #2E3D5A)' }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'rgba(144, 89, 225, 0.2)' }}>
                <Mail className="h-4 w-4" style={{ color: '#A78BFA' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>Quick Message</p>
                <p className="text-xs" style={{ color: '#9BA1B9' }}>We reply within 24 hours</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
              style={{ color: '#9BA1B9' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#9BA1B9'; e.currentTarget.style.background = 'transparent'; }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5">
            {submitted ? (
              <div className="text-center py-6">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(52, 211, 153, 0.1)' }}>
                  <Send className="h-6 w-6" style={{ color: '#34D399' }} />
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#26324E' }}>Message Sent!</p>
                <p className="text-xs mb-4" style={{ color: '#9BA1B9' }}>Thanks, {formData.name.split(' ')[0]}! We&apos;ll email you back soon.</p>
                <Button size="sm" onClick={resetAndClose} className="btn-secondary rounded-lg text-xs">Close</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#9BA1B9' }} />
                  <input
                    type="text" required placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full text-sm focus:outline-none transition-all"
                    style={{ padding: '10px 12px 10px 32px', borderRadius: '8px', background: '#F0F4F8', border: '1px solid #DAE2EC', color: '#26324E' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#9059E1'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#DAE2EC'; }}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#9BA1B9' }} />
                  <input
                    type="email" required placeholder="Your email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full text-sm focus:outline-none transition-all"
                    style={{ padding: '10px 12px 10px 32px', borderRadius: '8px', background: '#F0F4F8', border: '1px solid #DAE2EC', color: '#26324E' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#9059E1'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#DAE2EC'; }}
                  />
                </div>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-3.5 w-3.5" style={{ color: '#9BA1B9' }} />
                  <textarea
                    required rows={3} placeholder="How can we help?"
                    value={formData.message}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                    className="w-full text-sm focus:outline-none transition-all resize-none"
                    style={{ padding: '10px 12px 10px 32px', borderRadius: '8px', background: '#F0F4F8', border: '1px solid #DAE2EC', color: '#26324E', minHeight: '76px' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#9059E1'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#DAE2EC'; }}
                  />
                </div>
                <Button
                  type="submit" disabled={isSubmitting}
                  className="btn-primary gap-2 rounded-lg w-full text-sm"
                  style={{ height: '40px', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>

          <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid #DAE2EC', background: '#F0F4F8' }}>
            <a href="https://wa.me/923318333368" target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1.5 transition-colors" style={{ color: '#34D399' }}>
              WhatsApp Us
            </a>
            <a href="mailto:playbeatdigital@proton.me" className="text-xs flex items-center gap-1.5 transition-colors" style={{ color: '#9059E1' }}>
              Email Directly
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #9059E1, #7C3AED)', boxShadow: '0 4px 20px rgba(144, 89, 225, 0.4)' }}
        aria-label={isOpen ? 'Close contact form' : 'Open contact form'}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-white transition-transform duration-300" style={{ transform: 'rotate(90deg)' }} />
        ) : (
          <div className="relative">
            <Mail className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full" style={{ background: '#34D399', border: '2px solid #FFFFFF' }} />
          </div>
        )}
      </button>

      {/* Inline keyframes for slideIn animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fabSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  );
}
