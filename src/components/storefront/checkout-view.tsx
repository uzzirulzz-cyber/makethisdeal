'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Landmark,
  Wallet,
  Smartphone,
  CreditCard,
  Loader2,
  CheckCircle,
  CircleDot,
  Tag,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useCurrency } from '@/hooks/use-currency';
import type { PaymentMethodConfig, PaymentMethod } from '@/lib/types';
import { getCategoryName } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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

export default function CheckoutView() {
  const {
    cartItems,
    cartTotalPkr,
    cartLoading,
    fetchCart,
    setCurrentView,
  } = useAppStore();
  const { formatPrice, rateDisplay, mode, pkrToUsd } = useCurrency();

  // State
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [note, setNote] = useState('');
  const [jazzcashEmail, setJazzcashEmail] = useState('');
  const [payrailsEmail, setPayrailsEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const jazzcashFormRef = useRef<HTMLFormElement>(null);

  // Load cart & payment methods
  useEffect(() => {
    fetchCart();
    fetch('/api/payment-methods')
      .then((r) => r.json())
      .then((d) => setPaymentMethods(d.methods || []))
      .catch(() => {});
  }, [fetchCart]);

  const selectedMethodConfig = paymentMethods.find((m) => m.id === selectedMethod);
  const isManual = selectedMethodConfig?.mode === 'manual';

  // Total in PKR
  const totalPkr = cartTotalPkr;

  // Build JazzCash form and submit
  async function handleJazzCashPay() {
    if (!jazzcashEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/jazzcash/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountPkr: totalPkr,
          email: jazzcashEmail,
          name: buyerName || undefined,
          description: `Order for ${cartItems.length} item(s)`,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to create JazzCash session' }));
        toast.error(err.error || 'Failed to create JazzCash session');
        setSubmitting(false);
        return;
      }
      const data = await res.json();

      // Auto-submit form to JazzCash
      const form = jazzcashFormRef.current;
      if (form) {
        // Clear old inputs
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
        return; // Don't reset submitting — page will navigate
      }
    } catch {
      toast.error('Something went wrong');
    }
    setSubmitting(false);
  }

  // Handle Payrails mock
  async function handlePayrailsPay() {
    if (!payrailsEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }
    toast.info('Payrails integration coming soon. Please use manual payment.');
    return;
  }

  // Submit manual payment
  async function handleManualSubmit() {
    if (!buyerName.trim() || !buyerEmail.trim()) {
      toast.error('Please fill in buyer name and email');
      return;
    }
    if (!transactionRef.trim()) {
      toast.error('Please enter your transaction reference');
      return;
    }
    if (!selectedMethod) return;

    setSubmitting(true);
    try {
      // 1. Submit payment
      const payRes = await fetch('/api/payment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: selectedMethod,
          amountPkr: totalPkr,
          email: buyerEmail,
          name: buyerName,
          transactionRef,
          note: note || undefined,
        }),
      });
      if (!payRes.ok) {
        const err = await payRes.json().catch(() => ({ error: 'Payment submission failed' }));
        toast.error(err.error || 'Payment submission failed');
        setSubmitting(false);
        return;
      }

      // 2. Create order
      const sessionId = localStorage.getItem('mtd_cart_session');
      const orderRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          buyerName,
          buyerEmail,
          currencyMode: mode,
          exchangeRate: pkrToUsd,
          totalDisplay: mode === 'USD' ? totalPkr * pkrToUsd : totalPkr,
        }),
      });
      if (!orderRes.ok) {
        toast.error('Failed to create order. Payment was submitted.');
        setSubmitting(false);
        return;
      }
      const orderData = await orderRes.json();

      toast.success('Order placed successfully!');
      setCurrentView('landing');
    } catch {
      toast.error('Something went wrong');
    }
    setSubmitting(false);
  }

  if (cartLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-96 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Hidden JazzCash form */}
      <form ref={jazzcashFormRef} className="hidden" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setCurrentView('cart')}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="space-y-8">
        {/* Step 1: Buyer Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="f5-card p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <CircleDot className="size-5" style={{ color: '#8A2BE2' }} />
            <h2 className="font-semibold text-base">Buyer Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buyer-name">Full Name *</Label>
              <Input
                id="buyer-name"
                placeholder="Your full name"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyer-email">Email Address *</Label>
              <Input
                id="buyer-email"
                type="email"
                placeholder="you@example.com"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Step 2: Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="f5-card p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle className="size-5" style={{ color: '#8A2BE2' }} />
            <h2 className="font-semibold text-base">Order Summary</h2>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <Tag className="size-3.5 shrink-0" style={{ color: '#8A2BE2' }} />
                  <span className="truncate">{item.project?.name || 'Unknown Project'}</span>
                </div>
                <span className="font-medium whitespace-nowrap ml-2">
                  {formatPrice(item.pricePkr)}
                </span>
              </div>
            ))}
          </div>

          <Separator className="my-3" />

          <div className="flex justify-between items-baseline">
            <span className="font-semibold">Total (PKR)</span>
            <span className="font-bold text-xl" style={{ color: '#8A2BE2' }}>
              {formatPrice(totalPkr)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-right mt-1">{rateDisplay}</p>
        </motion.div>

        {/* Step 3: Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="f5-card p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <CreditCard className="size-5" style={{ color: '#8A2BE2' }} />
            <h2 className="font-semibold text-base">Payment Method</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentMethods.map((m) => {
              const Icon = METHOD_ICONS[m.id];
              const isSelected = selectedMethod === m.id;
              const accent = METHOD_ACCENTS[m.id];
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className="flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left"
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
                    <p className="text-xs text-muted-foreground truncate">{m.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Manual method account details */}
          {selectedMethod && isManual && selectedMethodConfig?.accountDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 rounded-lg border"
              style={{ backgroundColor: 'rgba(138,43,226,0.03)', borderColor: '#E5E7EB' }}
            >
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8A2BE2' }}>
                Transfer Details — {selectedMethodConfig.name}
              </h4>
              <div className="space-y-2 text-sm">
                {selectedMethodConfig.accountDetails.bank && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank</span>
                    <span className="font-medium">{selectedMethodConfig.accountDetails.bank}</span>
                  </div>
                )}
                {selectedMethodConfig.accountDetails.title && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Title</span>
                    <span className="font-medium">{selectedMethodConfig.accountDetails.title}</span>
                  </div>
                )}
                {selectedMethodConfig.accountDetails.number && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Number</span>
                    <span className="font-mono font-medium">{selectedMethodConfig.accountDetails.number}</span>
                  </div>
                )}
                {selectedMethodConfig.accountDetails.iban && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IBAN</span>
                    <span className="font-mono font-medium text-xs">{selectedMethodConfig.accountDetails.iban}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* JazzCash email + pay button */}
          {selectedMethod === 'jazzcash' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 space-y-3"
            >
              <div className="space-y-2">
                <Label htmlFor="jc-email">JazzCash Email</Label>
                <Input
                  id="jc-email"
                  type="email"
                  placeholder="your@email.com"
                  value={jazzcashEmail}
                  onChange={(e) => setJazzcashEmail(e.target.value)}
                />
              </div>
              <Button
                className="w-full gap-2 font-semibold"
                style={{ backgroundColor: '#EF4444' }}
                size="lg"
                disabled={submitting}
                onClick={handleJazzCashPay}
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Smartphone className="size-4" />
                )}
                Pay with JazzCash
              </Button>
            </motion.div>
          )}

          {/* Payrails email + pay button */}
          {selectedMethod === 'payrails' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 space-y-3"
            >
              <div className="space-y-2">
                <Label htmlFor="pr-email">Email Address</Label>
                <Input
                  id="pr-email"
                  type="email"
                  placeholder="your@email.com"
                  value={payrailsEmail}
                  onChange={(e) => setPayrailsEmail(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Pay with debit/credit card or digital wallet through Payrails secure checkout.
              </p>
              <Button
                className="w-full gap-2 font-semibold"
                style={{ backgroundColor: '#4DABF7' }}
                size="lg"
                disabled={submitting}
                onClick={handlePayrailsPay}
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CreditCard className="size-4" />
                )}
                Pay Now
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Step 4: Manual Payment Submit */}
        {selectedMethod && isManual && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="f5-card p-5 sm:p-6"
          >
            <h2 className="font-semibold text-base mb-4">Confirm Payment</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="txn-ref">Transaction Reference *</Label>
                <Input
                  id="txn-ref"
                  placeholder="e.g. TRF123456789"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pay-note">Note (optional)</Label>
                <Textarea
                  id="pay-note"
                  placeholder="Any additional details about your payment"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <Button
                className="w-full gap-2 font-semibold"
                style={{ backgroundColor: '#8A2BE2' }}
                size="lg"
                disabled={submitting || !transactionRef.trim() || !buyerName.trim() || !buyerEmail.trim()}
                onClick={handleManualSubmit}
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle className="size-4" />
                )}
                Submit Payment
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}