'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Landmark,
  Wallet,
  Smartphone,
  CreditCard,
  Loader2,
  Copy,
  CheckCircle,
} from 'lucide-react';
import { useCurrency } from '@/hooks/use-currency';
import type { PaymentMethodConfig, PaymentMethod } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const METHOD_ICONS: Record<PaymentMethod, React.ElementType> = {
  bankalfalah: Landmark,
  easypaisa: Wallet,
  jazzcash: Smartphone,
  payrails: CreditCard,
};

const METHOD_ACCENTS: Record<PaymentMethod, string> = {
  bankalfalah: '#22C55E',
  easypaisa: '#22C55E',
  jazzcash: '#EF4444',
  payrails: '#4DABF7',
};

interface PaymentWallProps {
  amountPkr: number;
  orderId?: string;
  onPaymentSuccess?: () => void;
  onBack?: () => void;
}

export default function PaymentWall({ amountPkr, orderId, onPaymentSuccess, onBack }: PaymentWallProps) {
  const { formatPrice, rateDisplay } = useCurrency();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const jazzcashFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch('/api/payment-methods')
      .then((r) => r.json())
      .then((d) => setPaymentMethods(d.methods || []))
      .catch(() => {});
  }, []);

  const selectedConfig = paymentMethods.find((m) => m.id === selectedMethod);
  const isManual = selectedConfig?.mode === 'manual';

  // Copy to clipboard
  function copyField(text: string, field: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedField(null), 2000);
    });
  }

  // JazzCash payment
  async function handleJazzCashPay() {
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/jazzcash/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountPkr,
          email,
          name: name || undefined,
          description: orderId ? `Order ${orderId}` : 'Payment',
          orderId: orderId || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed' }));
        toast.error(err.error || 'Failed to create JazzCash session');
        setSubmitting(false);
        return;
      }
      const data = await res.json();
      const form = jazzcashFormRef.current;
      if (form) {
        form.innerHTML = '';
        Object.entries(data.postData).forEach(([key, value]) => {
          const inp = document.createElement('input');
          inp.type = 'hidden';
          inp.name = key;
          inp.value = String(value);
          form.appendChild(inp);
        });
        form.action = data.apiUrl;
        form.method = 'POST';
        form.submit();
        return;
      }
    } catch {
      toast.error('Something went wrong');
    }
    setSubmitting(false);
  }

  // Payrails mock
  async function handlePayrailsPay() {
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    toast.info('Payrails integration coming soon. Please use manual payment.');
  }

  // Manual payment confirm
  async function handleManualConfirm() {
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in name and email');
      return;
    }
    if (!transactionRef.trim()) {
      toast.error('Please enter transaction reference');
      return;
    }
    if (!selectedMethod) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/payment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: selectedMethod,
          amountPkr,
          email,
          name,
          transactionRef,
          note: note || undefined,
          orderId: orderId || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Payment failed' }));
        toast.error(err.error || 'Payment failed');
        setSubmitting(false);
        return;
      }
      toast.success('Payment submitted! We will verify it shortly.');
      onPaymentSuccess?.();
    } catch {
      toast.error('Something went wrong');
    }
    setSubmitting(false);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Hidden JazzCash form */}
      <form ref={jazzcashFormRef} className="hidden" />

      <div className="f5-card p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="size-5" />
            </button>
          )}
          <div>
            <h2 className="text-lg font-bold">Complete Payment</h2>
            <p className="text-sm text-muted-foreground">{rateDisplay}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-bold" style={{ color: '#8A2BE2' }}>
              {formatPrice(amountPkr)}
            </p>
          </div>
        </div>

        {/* Method buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {paymentMethods.map((m) => {
            const Icon = METHOD_ICONS[m.id];
            const isSelected = selectedMethod === m.id;
            const accent = METHOD_ACCENTS[m.id];
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className="flex items-center gap-3 p-3.5 rounded-lg border-2 transition-all text-left"
                style={{
                  borderColor: isSelected ? '#8A2BE2' : '#E5E7EB',
                  backgroundColor: isSelected ? 'rgba(138,43,226,0.05)' : '#fff',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${accent}15` }}
                >
                  <Icon className="size-5" style={{ color: accent }} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{m.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{m.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Manual method: account details + form */}
        <AnimatePresence mode="wait">
          {selectedMethod && isManual && selectedConfig?.accountDetails && (
            <motion.div
              key={`${selectedMethod}-manual`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {/* Account details */}
              <div
                className="p-4 rounded-lg border mb-4"
                style={{ backgroundColor: 'rgba(138,43,226,0.03)', borderColor: '#E5E7EB' }}
              >
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8A2BE2' }}>
                  {selectedConfig.name} Account Details
                </h4>
                <div className="space-y-2.5 text-sm">
                  {selectedConfig.accountDetails.bank && (
                    <CopyableRow label="Bank" value={selectedConfig.accountDetails.bank} copiedField={copiedField} field="bank" onCopy={copyField} />
                  )}
                  {selectedConfig.accountDetails.title && (
                    <CopyableRow label="Title" value={selectedConfig.accountDetails.title} copiedField={copiedField} field="title" onCopy={copyField} />
                  )}
                  {selectedConfig.accountDetails.number && (
                    <CopyableRow label="Number" value={selectedConfig.accountDetails.number} copiedField={copiedField} field="number" onCopy={copyField} />
                  )}
                  {selectedConfig.accountDetails.iban && (
                    <CopyableRow label="IBAN" value={selectedConfig.accountDetails.iban} copiedField={copiedField} field="iban" onCopy={copyField} />
                  )}
                </div>
              </div>

              {/* Form */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Your Name *</Label>
                    <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Your Email *</Label>
                    <Input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Transaction Reference *</Label>
                  <Input placeholder="e.g. TRF123456789" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Note (optional)</Label>
                  <Textarea placeholder="Any details..." rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
                </div>
                <Button
                  className="w-full gap-2 font-semibold"
                  style={{ backgroundColor: '#8A2BE2' }}
                  size="lg"
                  disabled={submitting || !transactionRef.trim() || !name.trim() || !email.trim()}
                  onClick={handleManualConfirm}
                >
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
                  Confirm Payment
                </Button>
              </div>
            </motion.div>
          )}

          {selectedMethod === 'jazzcash' && (
            <motion.div
              key="jazzcash"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <div className="space-y-1.5">
                <Label className="text-xs">Email Address</Label>
                <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button
                className="w-full gap-2 font-semibold"
                style={{ backgroundColor: '#EF4444' }}
                size="lg"
                disabled={submitting}
                onClick={handleJazzCashPay}
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <Smartphone className="size-4" />}
                Pay Now with JazzCash
              </Button>
            </motion.div>
          )}

          {selectedMethod === 'payrails' && (
            <motion.div
              key="payrails"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <div className="space-y-1.5">
                <Label className="text-xs">Email Address</Label>
                <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <p className="text-xs text-muted-foreground">
                You&apos;ll be redirected to Payrails secure checkout to complete payment with card or wallet.
              </p>
              <Button
                className="w-full gap-2 font-semibold"
                style={{ backgroundColor: '#4DABF7' }}
                size="lg"
                disabled={submitting}
                onClick={handlePayrailsPay}
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
                Pay Now
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---- Copyable Row ---- */
function CopyableRow({
  label,
  value,
  copiedField,
  field,
  onCopy,
}: {
  label: string;
  value: string;
  copiedField: string | null;
  field: string;
  onCopy: (text: string, field: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="font-mono font-medium text-xs text-right">{value}</span>
        <button
          onClick={() => onCopy(value, field)}
          className="p-1 rounded hover:bg-muted transition-colors"
          title="Copy"
        >
          {copiedField === field ? (
            <CheckCircle className="size-3.5 text-green-500" />
          ) : (
            <Copy className="size-3.5 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}