'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  ShoppingCart,
  CreditCard,
  Server,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Landmark,
  Wallet,
  Smartphone,
  Eye,
  Loader2,
  ArrowLeft,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/store/use-app-store';
import { useCurrency } from '@/hooks/use-currency';
import { toast } from 'sonner';
import type { Order, PaymentSubmission, PaymentMethodConfig, PaymentStatus } from '@/lib/types';

// ─── F5 Studio Theme Constants ───────────────────────────────────────
const F5 = {
  navy: '#0A1128',
  violet: '#8A2BE2',
  pink: '#EC4899',
  blue: '#4DABF7',
  green: '#22C55E',
  red: '#EF4444',
  amber: '#F59E0B',
};

// ─── Status Badge Helper ─────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: '#FEF3C7', color: '#D97706', label: 'Pending' },
    confirmed: { bg: '#DCFCE7', color: '#16A34A', label: 'Confirmed' },
    rejected: { bg: '#FEE2E2', color: '#DC2626', label: 'Rejected' },
    paid: { bg: '#DBEAFE', color: '#2563EB', label: 'Paid' },
    refunded: { bg: '#F3E8FF', color: '#9333EA', label: 'Refunded' },
  };
  const s = map[status] || map.pending;
  return (
    <span
      style={{ backgroundColor: s.bg, color: s.color, fontWeight: 600, fontSize: '0.75rem', padding: '2px 10px', borderRadius: '9999px' }}
    >
      {s.label}
    </span>
  );
}

// ─── Payment Method Icon ─────────────────────────────────────────────
function PaymentMethodIcon({ method }: { method: string }) {
  switch (method) {
    case 'bankalfalah': return <Landmark size={18} style={{ color: F5.green }} />;
    case 'easypaisa': return <Wallet size={18} style={{ color: F5.green }} />;
    case 'jazzcash': return <Smartphone size={18} style={{ color: F5.red }} />;
    case 'payrails': return <CreditCard size={18} style={{ color: F5.blue }} />;
    default: return <CreditCard size={18} style={{ color: '#6B7280' }} />;
  }
}

// ─── Stat Card ────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border p-4 shadow-sm"
      style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}15`, width: 44, height: 44 }}
        >
          <Icon size={22} style={{ color }} />
        </div>
        <div>
          <p style={{ color: '#6B7280', fontSize: '0.8rem', fontWeight: 500 }}>{label}</p>
          <p style={{ color: '#111827', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────
function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 size={32} className="animate-spin" style={{ color: F5.violet }} />
      {label && <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>{label}</p>}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────
function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Icon size={48} style={{ color: '#D1D5DB' }} />
      <p style={{ color: '#9CA3AF', fontSize: '0.95rem' }}>{message}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  MAIN ADMIN PANEL COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export function AdminPanel() {
  const { isAdminAuthenticated, setAdminAuthenticated, setCurrentView } = useAppStore();
  const { formatPrice } = useCurrency();

  // ─── Auth State ──────────────────────────────────────────────────
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');

  // ─── Data State ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<PaymentSubmission[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<string>('pending');

  // ─── UI State ────────────────────────────────────────────────────
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [methodsLoading, setMethodsLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // ─── Dialog State ────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'confirm' | 'reject'>('confirm');
  const [dialogTarget, setDialogTarget] = useState<{ id: string; type: 'payment' | 'order' }>({ id: '', type: 'payment' });
  const [adminNote, setAdminNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // ─── Auth Handler ────────────────────────────────────────────────
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setAdminSecret(password.trim());
    setAdminAuthenticated(true);
    toast.success('Admin access granted');
  };

  // ─── Fetch Orders ────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders?limit=50', {
        headers: { 'x-admin-secret': adminSecret },
      });
      if (res.status === 401) {
        toast.error('Invalid admin secret');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch {
      toast.error('Network error fetching orders');
    } finally {
      setOrdersLoading(false);
    }
  }, [adminSecret]);

  // ─── Fetch Payments ──────────────────────────────────────────────
  const fetchPayments = useCallback(async (status?: string) => {
    setPaymentsLoading(true);
    try {
      const params = new URLSearchParams();
      if (status && status !== 'all') params.set('status', status);
      params.set('limit', '50');
      const res = await fetch(`/api/payment/list?${params.toString()}`, {
        headers: { 'x-admin-secret': adminSecret },
      });
      if (res.status === 401) {
        toast.error('Invalid admin secret');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      } else {
        toast.error('Failed to fetch payments');
      }
    } catch {
      toast.error('Network error fetching payments');
    } finally {
      setPaymentsLoading(false);
    }
  }, [adminSecret]);

  // ─── Fetch Payment Methods ───────────────────────────────────────
  const fetchMethods = useCallback(async () => {
    setMethodsLoading(true);
    try {
      const res = await fetch('/api/payment-methods');
      if (res.ok) {
        const data = await res.json();
        setPaymentMethods(data.methods || []);
      }
    } catch {
      // silent
    } finally {
      setMethodsLoading(false);
    }
  }, []);

  // ─── Load on Tab Change ──────────────────────────────────────────
  useEffect(() => {
    if (!isAdminAuthenticated) return;
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'payments') fetchPayments(paymentFilter);
    if (activeTab === 'gateways') fetchMethods();
  }, [activeTab, isAdminAuthenticated, fetchOrders, fetchPayments, fetchMethods, paymentFilter]);

  // ─── Open Action Dialog ──────────────────────────────────────────
  const openActionDialog = (id: string, action: 'confirm' | 'reject', type: 'payment' | 'order' = 'payment') => {
    setDialogTarget({ id, type });
    setDialogAction(action);
    setAdminNote('');
    setDialogOpen(true);
  };

  // ─── Submit Action ───────────────────────────────────────────────
  const handleAction = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify({
          id: dialogTarget.id,
          action: dialogAction,
          adminNote: adminNote.trim() || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(`Payment ${dialogAction === 'confirm' ? 'confirmed' : 'rejected'} successfully`);
        setDialogOpen(false);
        // Refresh data
        fetchPayments(paymentFilter);
        fetchOrders();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Action failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Order Stats ─────────────────────────────────────────────────
  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending' || o.paymentStatus === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed' || o.status === 'paid').length,
    rejected: orders.filter((o) => o.status === 'rejected').length,
  };

  // ─── Format Date ─────────────────────────────────────────────────
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ═══════════════════════════════════════════════════════════════════
  //  AUTHENTICATION GATE
  // ═══════════════════════════════════════════════════════════════════
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: `linear-gradient(135deg, ${F5.navy} 0%, #1a1a3e 100%)` }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
          style={{ background: '#FFFFFF', border: `1px solid #E5E7EB` }}
        >
          <div className="flex flex-col items-center gap-4 mb-8">
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 64, height: 64, background: `${F5.violet}15` }}
            >
              <Shield size={32} style={{ color: F5.violet }} />
            </div>
            <div className="text-center">
              <h1 style={{ color: F5.navy, fontSize: '1.5rem', fontWeight: 800 }}>Admin Access</h1>
              <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: 4 }}>
                Enter your admin password to continue
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="admin-password" style={{ color: '#374151', fontWeight: 600, fontSize: '0.85rem' }}>
                Password
              </Label>
              <div className="relative">
                <Lock size={16} style={{ color: '#9CA3AF' }} className="absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter admin secret"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  style={{ borderColor: '#D1D5DB' }}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={!password.trim()}
              className="w-full text-white font-semibold py-5"
              style={{ background: password.trim() ? F5.violet : '#D1D5DB' }}
            >
              <Shield size={18} className="mr-2" />
              Unlock Admin Panel
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-1 mx-auto text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: '#6B7280' }}
            >
              <ArrowLeft size={14} />
              Back to Marketplace
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  DASHBOARD
  // ═══════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
      {/* ─── Top Bar ──────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm"
        style={{ background: '#FFFFFF', borderBottom: `2px solid ${F5.violet}` }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: '#6B7280' }}
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <Separator orientation="vertical" className="h-5 hidden sm:block" style={{ borderColor: '#E5E7EB' }} />
          <div className="flex items-center gap-2">
            <Shield size={20} style={{ color: F5.violet }} />
            <h1 style={{ color: F5.navy, fontSize: '1.1rem', fontWeight: 700 }}>Admin Panel</h1>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setAdminAuthenticated(false); setAdminSecret(''); setCurrentView('landing'); }}
          style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
        >
          <Lock size={14} className="mr-1" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className="w-full sm:w-auto mb-6"
            style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: 4 }}
          >
            <TabsTrigger
              value="orders"
              className="flex-1 sm:flex-none data-[state=active]:text-white"
              style={{
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              <ShoppingCart size={16} className="mr-1.5" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="flex-1 sm:flex-none data-[state=active]:text-white"
              style={{
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              <CreditCard size={16} className="mr-1.5" />
              Payments
            </TabsTrigger>
            <TabsTrigger
              value="gateways"
              className="flex-1 sm:flex-none data-[state=active]:text-white"
              style={{
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              <Server size={16} className="mr-1.5" />
              Gateways
            </TabsTrigger>
          </TabsList>

          {/* ═══════════════════════════════════════════════════════════
              TAB 1: ORDERS
          ═══════════════════════════════════════════════════════════ */}
          <TabsContent value="orders">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Orders" value={orderStats.total} icon={Package} color={F5.violet} />
              <StatCard label="Pending" value={orderStats.pending} icon={Clock} color={F5.amber} />
              <StatCard label="Confirmed" value={orderStats.confirmed} icon={CheckCircle2} color={F5.green} />
              <StatCard label="Rejected" value={orderStats.rejected} icon={XCircle} color={F5.red} />
            </div>

            {/* Refresh */}
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ color: F5.navy, fontSize: '1.1rem', fontWeight: 700 }}>All Orders</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
                disabled={ordersLoading}
                style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
              >
                <RefreshCw size={14} className={`mr-1.5 ${ordersLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {ordersLoading ? (
              <LoadingSpinner label="Loading orders..." />
            ) : orders.length === 0 ? (
              <EmptyState icon={Package} message="No orders found" />
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block rounded-xl border overflow-hidden" style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" style={{ minWidth: 800 }}>
                      <thead>
                        <tr style={{ background: '#F9FAFB', borderBottom: `2px solid #E5E7EB` }}>
                          {['Order #', 'Buyer', 'Items', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map((h) => (
                            <th
                              key={h}
                              className="text-left px-4 py-3 font-semibold"
                              style={{ color: '#374151', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, idx) => {
                          const isExpanded = expandedOrder === order.id;
                          return (
                            <Fragment key={order.id}>
                              <tr
                                style={{
                                  background: isExpanded ? '#F5F3FF' : idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                                  borderBottom: '1px solid #F3F4F6',
                                }}
                              >
                                <td className="px-4 py-3">
                                  <span style={{ color: F5.violet, fontWeight: 600, fontSize: '0.85rem' }}>
                                    #{order.orderNumber}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div>
                                    <p style={{ color: '#111827', fontWeight: 500 }}>{order.buyerName}</p>
                                    <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>{order.buyerEmail}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span style={{ color: '#374151' }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <span style={{ color: '#111827', fontWeight: 700 }}>{formatPrice(order.totalPkr)}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1.5">
                                    <PaymentMethodIcon method={order.paymentMethod || 'payrails'} />
                                    <span style={{ color: '#374151', textTransform: 'capitalize', fontSize: '0.8rem' }}>
                                      {order.paymentMethod || 'N/A'}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <StatusBadge status={order.status} />
                                </td>
                                <td className="px-4 py-3">
                                  <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                                    {new Date(order.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short' })}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                      style={{ color: '#6B7280', padding: '4px 8px' }}
                                    >
                                      <Eye size={14} />
                                    </Button>
                                    {order.payments.some((p) => p.status === 'pending') && (
                                      <>
                                        <Button
                                          size="sm"
                                          onClick={() => {
                                            const pendingPayment = order.payments.find((p) => p.status === 'pending');
                                            if (pendingPayment) openActionDialog(pendingPayment.id, 'confirm');
                                          }}
                                          style={{ background: F5.green, color: '#FFFFFF', padding: '4px 10px', fontSize: '0.75rem' }}
                                        >
                                          <CheckCircle2 size={13} />
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() => {
                                            const pendingPayment = order.payments.find((p) => p.status === 'pending');
                                            if (pendingPayment) openActionDialog(pendingPayment.id, 'reject');
                                          }}
                                          style={{ background: F5.red, color: '#FFFFFF', padding: '4px 10px', fontSize: '0.75rem' }}
                                        >
                                          <XCircle size={13} />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                              {/* Expanded Details */}
                              {isExpanded && (
                                <tr style={{ background: '#F5F3FF' }}>
                                  <td colSpan={8} className="px-4 py-4">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                      {/* Order Items */}
                                      <div>
                                        <h4 style={{ color: '#374151', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>Order Items</h4>
                                        <div className="flex flex-col gap-2">
                                          {order.items.map((item) => (
                                            <div
                                              key={item.id}
                                              className="flex items-center justify-between rounded-lg p-3"
                                              style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
                                            >
                                              <div>
                                                <p style={{ color: '#111827', fontWeight: 600, fontSize: '0.85rem' }}>{item.projectName}</p>
                                                <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Project ID: {item.projectId.slice(0, 8)}...</p>
                                              </div>
                                              <span style={{ color: F5.violet, fontWeight: 700, fontSize: '0.9rem' }}>{formatPrice(item.pricePkr)}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      {/* Payment Details */}
                                      <div>
                                        <h4 style={{ color: '#374151', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>Payments</h4>
                                        {order.payments.length === 0 ? (
                                          <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>No payments recorded</p>
                                        ) : (
                                          <div className="flex flex-col gap-2">
                                            {order.payments.map((p) => (
                                              <div
                                                key={p.id}
                                                className="rounded-lg p-3"
                                                style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
                                              >
                                                <div className="flex items-center justify-between mb-2">
                                                  <div className="flex items-center gap-2">
                                                    <PaymentMethodIcon method={p.method} />
                                                    <span style={{ color: '#374151', fontWeight: 600, textTransform: 'capitalize', fontSize: '0.85rem' }}>{p.method}</span>
                                                  </div>
                                                  <StatusBadge status={p.status} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-1 text-xs" style={{ color: '#6B7280' }}>
                                                  <span>Amount: <b style={{ color: '#111827' }}>{formatPrice(p.amountPkr)}</b></span>
                                                  <span>Ref: <b style={{ color: '#111827' }}>{p.transactionRef || 'N/A'}</b></span>
                                                  <span>Email: <b style={{ color: '#111827' }}>{p.email}</b></span>
                                                  <span>Date: <b style={{ color: '#111827' }}>{formatDate(p.createdAt)}</b></span>
                                                </div>
                                                {p.adminNote && (
                                                  <p className="mt-2 text-xs" style={{ color: F5.amber }}>
                                                    <AlertTriangle size={12} className="inline mr-1" />
                                                    Admin: {p.adminNote}
                                                  </p>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden flex flex-col gap-3">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      layout
                      className="rounded-xl p-4 shadow-sm"
                      style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span style={{ color: F5.violet, fontWeight: 700, fontSize: '0.9rem' }}>#{order.orderNumber}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="flex flex-col gap-1.5 text-sm mb-3">
                        <div className="flex justify-between">
                          <span style={{ color: '#6B7280' }}>Buyer</span>
                          <span style={{ color: '#111827', fontWeight: 500 }}>{order.buyerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: '#6B7280' }}>Items</span>
                          <span style={{ color: '#111827' }}>{order.items.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: '#6B7280' }}>Amount</span>
                          <span style={{ color: '#111827', fontWeight: 700 }}>{formatPrice(order.totalPkr)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span style={{ color: '#6B7280' }}>Method</span>
                          <div className="flex items-center gap-1.5">
                            <PaymentMethodIcon method={order.paymentMethod || 'payrails'} />
                            <span style={{ color: '#374151', textTransform: 'capitalize', fontSize: '0.8rem' }}>
                              {order.paymentMethod || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: '#6B7280' }}>Date</span>
                          <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      </div>
                      {order.payments.some((p) => p.status === 'pending') && (
                        <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid #F3F4F6' }}>
                          <Button
                            size="sm"
                            className="flex-1 text-white"
                            onClick={() => {
                              const pp = order.payments.find((p) => p.status === 'pending');
                              if (pp) openActionDialog(pp.id, 'confirm');
                            }}
                            style={{ background: F5.green, fontSize: '0.8rem' }}
                          >
                            <CheckCircle2 size={14} className="mr-1" /> Confirm
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 text-white"
                            onClick={() => {
                              const pp = order.payments.find((p) => p.status === 'pending');
                              if (pp) openActionDialog(pp.id, 'reject');
                            }}
                            style={{ background: F5.red, fontSize: '0.8rem' }}
                          >
                            <XCircle size={14} className="mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════════
              TAB 2: PAYMENTS
          ═══════════════════════════════════════════════════════════ */}
          <TabsContent value="payments">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {[
                { key: 'all', label: 'All' },
                { key: 'pending', label: 'Pending' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'rejected', label: 'Rejected' },
              ].map((f) => (
                <Button
                  key={f.key}
                  variant={paymentFilter === f.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPaymentFilter(f.key)}
                  style={
                    paymentFilter === f.key
                      ? { background: F5.violet, color: '#FFFFFF', fontWeight: 600, fontSize: '0.8rem' }
                      : { borderColor: '#E5E7EB', color: '#6B7280', fontSize: '0.8rem' }
                  }
                >
                  {f.label}
                </Button>
              ))}
              <div className="flex-1" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPayments(paymentFilter)}
                disabled={paymentsLoading}
                style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
              >
                <RefreshCw size={14} className={`mr-1.5 ${paymentsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {paymentsLoading ? (
              <LoadingSpinner label="Loading payments..." />
            ) : payments.length === 0 ? (
              <EmptyState icon={CreditCard} message="No payments found" />
            ) : (
              <ScrollArea className="max-h-[600px] overflow-y-auto">
                <div className="flex flex-col gap-3 pr-3">
                  {payments.map((payment) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl p-4 shadow-sm"
                      style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        {/* Left: Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="flex items-center justify-center rounded-lg"
                              style={{ width: 36, height: 36, background: `${F5.violet}10` }}
                            >
                              <PaymentMethodIcon method={payment.method} />
                            </div>
                            <div className="min-w-0">
                              <p style={{ color: '#111827', fontWeight: 700, fontSize: '0.9rem', textTransform: 'capitalize' }}>
                                {payment.method}
                              </p>
                              <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
                                ID: {payment.id.slice(0, 8)}...
                              </p>
                            </div>
                            <div className="ml-auto sm:ml-3">
                              <StatusBadge status={payment.status} />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mt-3">
                            <div>
                              <p style={{ color: '#9CA3AF', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</p>
                              <p style={{ color: '#111827', fontWeight: 700 }}>{formatPrice(payment.amountPkr)}</p>
                            </div>
                            <div>
                              <p style={{ color: '#9CA3AF', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</p>
                              <p style={{ color: '#374151', fontSize: '0.8rem' }} className="truncate">{payment.email}</p>
                            </div>
                            <div>
                              <p style={{ color: '#9CA3AF', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transaction Ref</p>
                              <p style={{ color: '#374151', fontSize: '0.8rem' }}>{payment.transactionRef || 'N/A'}</p>
                            </div>
                            <div>
                              <p style={{ color: '#9CA3AF', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</p>
                              <p style={{ color: '#374151', fontSize: '0.8rem' }}>
                                {new Date(payment.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>

                          {payment.name && (
                            <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
                              From: <b style={{ color: '#111827' }}>{payment.name}</b>
                            </p>
                          )}
                          {payment.note && (
                            <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
                              Note: {payment.note}
                            </p>
                          )}
                          {payment.adminNote && (
                            <p className="mt-1 text-sm" style={{ color: F5.amber }}>
                              <AlertTriangle size={12} className="inline mr-1" />
                              Admin: {payment.adminNote}
                            </p>
                          )}
                        </div>

                        {/* Right: Actions */}
                        {payment.status === 'pending' && (
                          <div className="flex sm:flex-col gap-2 sm:ml-4 shrink-0">
                            <Button
                              size="sm"
                              className="text-white"
                              onClick={() => openActionDialog(payment.id, 'confirm')}
                              style={{ background: F5.green, fontWeight: 600, fontSize: '0.8rem' }}
                            >
                              <CheckCircle2 size={14} className="mr-1" />
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              className="text-white"
                              onClick={() => openActionDialog(payment.id, 'reject')}
                              style={{ background: F5.red, fontWeight: 600, fontSize: '0.8rem' }}
                            >
                              <XCircle size={14} className="mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════════
              TAB 3: GATEWAYS
          ═══════════════════════════════════════════════════════════ */}
          <TabsContent value="gateways">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: F5.navy, fontSize: '1.1rem', fontWeight: 700 }}>Payment Gateways</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchMethods}
                disabled={methodsLoading}
                style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
              >
                <RefreshCw size={14} className={`mr-1.5 ${methodsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {methodsLoading ? (
              <LoadingSpinner label="Loading gateways..." />
            ) : paymentMethods.length === 0 ? (
              <EmptyState icon={Server} message="No payment gateways configured" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl p-5 shadow-sm"
                    style={{
                      background: '#FFFFFF',
                      border: `1px solid ${method.enabled ? '#E5E7EB' : '#FCA5A5'}`,
                      opacity: method.enabled ? 1 : 0.7,
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="flex items-center justify-center rounded-lg"
                        style={{ width: 44, height: 44, background: `${F5.violet}10` }}
                      >
                        <PaymentMethodIcon method={method.id} />
                      </div>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: method.enabled ? '#DCFCE7' : '#FEE2E2',
                          color: method.enabled ? '#16A34A' : '#DC2626',
                        }}
                      >
                        {method.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>

                    <h3 style={{ color: '#111827', fontWeight: 700, fontSize: '1rem' }}>{method.name}</h3>
                    <p style={{ color: '#6B7280', fontSize: '0.8rem', marginTop: 2 }}>{method.description}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background: method.mode === 'api' ? '#DBEAFE' : '#FEF3C7',
                          color: method.mode === 'api' ? '#2563EB' : '#D97706',
                        }}
                      >
                        {method.mode === 'api' ? 'API' : 'Manual'}
                      </span>
                    </div>

                    {method.mode === 'manual' && method.accountDetails && (
                      <div className="mt-4 pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
                        <div className="flex flex-col gap-1.5 text-xs">
                          {method.accountDetails.bank && (
                            <div className="flex justify-between">
                              <span style={{ color: '#9CA3AF' }}>Bank</span>
                              <span style={{ color: '#374151', fontWeight: 500 }}>{method.accountDetails.bank}</span>
                            </div>
                          )}
                          {method.accountDetails.title && (
                            <div className="flex justify-between">
                              <span style={{ color: '#9CA3AF' }}>Title</span>
                              <span style={{ color: '#374151', fontWeight: 500 }}>{method.accountDetails.title}</span>
                            </div>
                          )}
                          {method.accountDetails.number && (
                            <div className="flex justify-between">
                              <span style={{ color: '#9CA3AF' }}>Account #</span>
                              <span style={{ color: '#374151', fontWeight: 600 }}>{method.accountDetails.number}</span>
                            </div>
                          )}
                          {method.accountDetails.iban && (
                            <div className="flex justify-between">
                              <span style={{ color: '#9CA3AF' }}>IBAN</span>
                              <span style={{ color: '#374151', fontWeight: 600, fontSize: '0.7rem' }}>{method.accountDetails.iban}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ACTION DIALOG (Confirm/Reject Payment)
      ═════════════════════════════════════════════════════════════════ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent style={{ borderColor: '#E5E7EB' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: F5.navy }}>
              {dialogAction === 'confirm' ? (
                <CheckCircle2 size={20} style={{ color: F5.green }} />
              ) : (
                <XCircle size={20} style={{ color: F5.red }} />
              )}
              {dialogAction === 'confirm' ? 'Confirm Payment' : 'Reject Payment'}
            </DialogTitle>
            <DialogDescription style={{ color: '#6B7280' }}>
              {dialogAction === 'confirm'
                ? 'Are you sure you want to confirm this payment? The order will be marked as confirmed.'
                : 'Are you sure you want to reject this payment? The order will be marked as rejected.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2">
            <div>
              <Label style={{ color: '#374151', fontWeight: 600, fontSize: '0.85rem' }}>Admin Note (Optional)</Label>
              <Textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add a note for this action..."
                className="mt-1.5"
                rows={3}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={actionLoading}
              style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={actionLoading}
              className="text-white"
              style={{ background: dialogAction === 'confirm' ? F5.green : F5.red }}
            >
              {actionLoading ? (
                <Loader2 size={14} className="animate-spin mr-1.5" />
              ) : dialogAction === 'confirm' ? (
                <CheckCircle2 size={14} className="mr-1.5" />
              ) : (
                <XCircle size={14} className="mr-1.5" />
              )}
              {dialogAction === 'confirm' ? 'Confirm Payment' : 'Reject Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminPanel;