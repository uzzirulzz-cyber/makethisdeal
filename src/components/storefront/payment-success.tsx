'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowLeft, Home, ClipboardList } from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useCurrency } from '@/hooks/use-currency';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/lib/types';

export default function PaymentSuccess() {
  const { setCurrentView } = useAppStore();
  const { formatPrice } = useCurrency();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchedStatus, setFetchedStatus] = useState<'success' | 'pending' | 'failed' | null>(null);

  // Read URL params synchronously via useMemo (no setState)
  const urlStatus = useMemo<'success' | 'failed' | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    if (payment === 'failed') return 'failed';
    if (payment === 'success') return 'success';
    return null;
  }, []);

  const orderId = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('orderId');
  }, []);

  // Derive display status: URL param takes priority, then fetched
  const paymentStatus = urlStatus || fetchedStatus;

  useEffect(() => {
    if (urlStatus === 'failed') {
      // Use microtask to avoid synchronous setState in effect
      Promise.resolve().then(() => setLoading(false));
      return;
    }

    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((r) => {
          if (r.ok) return r.json();
          throw new Error('not found');
        })
        .then((d) => {
          setOrder(d.order);
          setFetchedStatus(d.order.paymentStatus === 'confirmed' ? 'success' : 'pending');
        })
        .catch(() => {
          setFetchedStatus('failed');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      Promise.resolve().then(() => setLoading(false));
    }
  }, [urlStatus, orderId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-20 w-20 bg-muted rounded-full mx-auto" />
          <div className="h-8 w-48 bg-muted rounded mx-auto" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="f5-card p-6 sm:p-8 text-center"
      >
        {paymentStatus === 'failed' ? (
          <>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
            >
              <XCircle className="size-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Your payment could not be processed. Please try again or contact support.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="size-4" />
                Try Again
              </Button>
              <Button
                className="gap-2"
                style={{ backgroundColor: '#8A2BE2' }}
                onClick={() => setCurrentView('landing')}
              >
                <Home className="size-4" />
                Back to Marketplace
              </Button>
            </div>
          </>
        ) : (
          <>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}
            >
              <CheckCircle className="size-10 text-green-500" />
            </div>

            <h1 className="text-2xl font-bold mb-1">
              {paymentStatus === 'pending' ? 'Payment Submitted!' : 'Payment Confirmed!'}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {paymentStatus === 'pending'
                ? 'Your payment is being reviewed. You will receive a confirmation once verified.'
                : 'Your payment has been confirmed. Thank you for your purchase!'}
            </p>

            {/* Order details */}
            {order && (
              <div
                className="text-left rounded-lg border p-4 sm:p-5 mb-6"
                style={{ backgroundColor: 'rgba(138,43,226,0.02)', borderColor: '#E5E7EB' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Order Number</span>
                  <Badge
                    variant="outline"
                    className="font-mono text-xs"
                    style={{ borderColor: '#8A2BE2', color: '#8A2BE2' }}
                  >
                    {order.orderNumber}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-xl font-bold" style={{ color: '#8A2BE2' }}>
                    {formatPrice(order.totalPkr)}
                  </span>
                </div>

                {order.items && order.items.length > 0 && (
                  <>
                    <Separator className="mb-3" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8A2BE2' }}>
                      Items
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="truncate mr-2">{item.projectName}</span>
                          <span className="font-medium whitespace-nowrap">{formatPrice(item.pricePkr)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {order.payments && order.payments.length > 0 && (
                  <>
                    <Separator className="my-3" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8A2BE2' }}>
                      Payment
                    </h4>
                    <div className="space-y-1 text-sm">
                      {order.payments.map((p) => (
                        <div key={p.id} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">{p.method}</span>
                          <Badge
                            variant="secondary"
                            className="text-[10px] capitalize"
                            style={{
                              backgroundColor:
                                p.status === 'confirmed'
                                  ? 'rgba(34,197,94,0.1)'
                                  : p.status === 'rejected'
                                    ? 'rgba(239,68,68,0.1)'
                                    : 'rgba(138,43,226,0.1)',
                              color:
                                p.status === 'confirmed'
                                  ? '#22C55E'
                                  : p.status === 'rejected'
                                    ? '#EF4444'
                                    : '#8A2BE2',
                            }}
                          >
                            {p.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <Button
                className="gap-2"
                style={{ backgroundColor: '#8A2BE2' }}
                onClick={() => setCurrentView('landing')}
              >
                <Home className="size-4" />
                Back to Marketplace
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setCurrentView('dashboard')}
              >
                <ClipboardList className="size-4" />
                View Orders
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}