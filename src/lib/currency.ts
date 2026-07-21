export type CurrencyMode = 'PKR' | 'USD';

export interface CurrencyState {
  mode: CurrencyMode;
  pkrToUsd: number;       // 1 PKR = X USD (e.g. 0.0036)
  usdToPkr: number;       // 1 USD = X PKR (e.g. 278)
  rateLoading: boolean;
  setMode: (mode: CurrencyMode) => void;
  toggleMode: () => void;
  setRate: (pkrToUsd: number, usdToPkr: number) => void;
  setRateLoading: (loading: boolean) => void;
}

/* ---------- Region detection ---------- */

const PAKISTAN_TIMEZONES = [
  'Asia/Karachi',
  'Asia/Kolkata', // covers some Pakistan border areas
];

export function detectRegion(): CurrencyMode {
  if (typeof window === 'undefined') return 'PKR';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (PAKISTAN_TIMEZONES.includes(tz)) return 'PKR';
  } catch {
    // ignore
  }
  return 'USD';
}

/* ---------- Formatting ---------- */

export function formatCompact(value: number | undefined, mode: CurrencyMode, pkrToUsd: number): string {
  if (value === undefined || value === null) return '—';

  if (mode === 'USD') {
    const usd = value * pkrToUsd;
    if (usd >= 1_000_000) return `US$ ${(usd / 1_000_000).toFixed(1)}M`;
    if (usd >= 1_000) return `US$ ${(usd / 1_000).toFixed(1)}K`;
    return `US$ ${Math.round(usd).toLocaleString()}`;
  }

  // PKR mode
  if (value >= 1_000_000_000) return `PKR ${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `PKR ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `PKR ${(value / 1_000).toFixed(0)}K`;
  return `PKR ${value.toLocaleString()}`;
}

/** Convert a PKR value to the active currency number (for calculations) */
export function convertValue(pkrValue: number, mode: CurrencyMode, pkrToUsd: number): number {
  if (mode === 'USD') return Math.round(pkrValue * pkrToUsd);
  return pkrValue;
}

/** Return the currency symbol for the active mode */
export function currencySymbol(mode: CurrencyMode): string {
  return mode === 'USD' ? 'US$' : 'PKR';
}

/** Format a filter input value: users always type in PKR, but the label changes */
export function filterCurrencyLabel(mode: CurrencyMode): string {
  return mode === 'USD' ? 'US$' : 'PKR';
}