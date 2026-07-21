import type { PaymentMethodConfig } from '@/lib/types';

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'bankalfalah',
    name: 'Bank Alfalah',
    description: 'Direct bank transfer to our Bank Alfalah account',
    icon: 'landmark',
    mode: 'manual',
    enabled: true,
    accountDetails: {
      bank: 'Bank Alfalah',
      title: 'PLAYBEAT DIGITAL (PRIVATE LIMITED)',
      number: '00681011050474',
      iban: process.env.BANK_ALFALAH_IBAN || undefined,
    },
  },
  {
    id: 'easypaisa',
    name: 'Easypaisa',
    description: 'Transfer via Easypaisa app or agent',
    icon: 'wallet',
    mode: 'manual',
    enabled: true,
    accountDetails: {
      bank: 'Telenor Microfinance Bank',
      title: 'Playbeat Digital',
      number: '0000000094799151',
      iban: 'PK25TMFB0000000094799151',
    },
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    description: 'Pay securely via JazzCash hosted payment page',
    icon: 'smartphone',
    mode: 'api',
    enabled: !!process.env.JAZZCASH_PASSWORD && !!process.env.JAZZCASH_INTEGRITY_SALT,
  },
  {
    id: 'payrails',
    name: 'Card / Payrails',
    description: 'Pay with debit/credit card or digital wallet',
    icon: 'credit-card',
    mode: 'api',
    enabled: !!process.env.PAYRAILS_API_KEY && !!process.env.PAYRAILS_CLIENT_ID,
  },
];

export function getPaymentMethod(id: string): PaymentMethodConfig | undefined {
  return PAYMENT_METHODS.find((m) => m.id === id);
}

export function getEnabledMethods(): PaymentMethodConfig[] {
  return PAYMENT_METHODS.filter((m) => m.enabled);
}

export function isAdminSecretValid(secret: string): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return false;
  return secret === adminSecret;
}

/** Generate a human-readable order number */
export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now.getFullYear().toString().slice(2) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MTD-${datePart}-${rand}`;
}
