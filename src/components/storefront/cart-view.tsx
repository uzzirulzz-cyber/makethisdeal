'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, ArrowLeft, Tag } from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { useCurrency } from '@/hooks/use-currency';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getCategoryName } from '@/lib/constants';

export default function CartView() {
  const {
    cartItems,
    cartTotalPkr,
    cartLoading,
    fetchCart,
    removeFromCart,
    clearCart,
    setCurrentView,
    goToProject,
  } = useAppStore();
  const { formatPrice, rateDisplay } = useCurrency();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (cartLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: 'rgba(138,43,226,0.08)' }}
          >
            <ShoppingBag className="size-12" style={{ color: '#8A2BE2' }} />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Browse our marketplace and add projects to your cart to get started.
          </p>
          <Button
            onClick={() => setCurrentView('browse')}
            className="gap-2 px-6"
            style={{ backgroundColor: '#8A2BE2' }}
          >
            <ShoppingBag className="size-4" />
            Browse Projects
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('browse')}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-2xl font-bold">
            Shopping Cart{' '}
            <span className="text-base font-normal text-muted-foreground">
              ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.25 }}
                className="f5-card p-4 flex items-center gap-4"
              >
                {/* Project icon placeholder */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(138,43,226,0.08)' }}
                >
                  <Tag className="size-5" style={{ color: '#8A2BE2' }} />
                </div>

                {/* Item details */}
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => goToProject(item.projectId)}
                    className="font-semibold text-sm hover:underline text-left truncate block w-full"
                    style={{ color: '#8A2BE2' }}
                  >
                    {item.project?.name || 'Unknown Project'}
                  </button>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className="text-[10px] px-1.5 py-0 border-0"
                      style={{ backgroundColor: '#8A2BE2', color: '#fff' }}
                    >
                      {item.project?.category
                        ? getCategoryName(item.project.category)
                        : 'Project'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {item.priceType.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <p className="font-bold text-sm whitespace-nowrap" style={{ color: '#8A2BE2' }}>
                  {formatPrice(item.pricePkr)}
                </p>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                  aria-label="Remove item"
                >
                  <Trash2 className="size-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Clear Cart */}
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-muted-foreground hover:text-red-500 hover:border-red-200"
              onClick={() => {
                clearCart();
                // Also clear server-side cart
                const sid = localStorage.getItem('mtd_cart_session');
                if (sid) {
                  fetch('/api/cart?sessionId=' + sid, { method: 'DELETE' }).catch(() => {});
                }
              }}
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="f5-card p-5 sticky top-6">
            <h3 className="font-semibold text-base mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items ({cartItems.length})</span>
                <span className="font-medium">{formatPrice(cartTotalPkr)}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-baseline">
                <span className="font-semibold">Subtotal (PKR)</span>
                <span className="font-bold text-lg" style={{ color: '#8A2BE2' }}>
                  {formatPrice(cartTotalPkr)}
                </span>
              </div>

              <p className="text-xs text-muted-foreground text-right">{rateDisplay}</p>
            </div>

            <Button
              className="w-full mt-6 gap-2 text-sm font-semibold"
              style={{ backgroundColor: '#8A2BE2' }}
              size="lg"
              onClick={() => setCurrentView('checkout')}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}