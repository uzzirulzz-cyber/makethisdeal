export type CurrencyMode = 'PKR' | 'USD';

/* ─── Values in DB are now stored in USD ─── */
const USD_TO_PKR = 278;

export function detectRegion(): CurrencyMode {
  if (typeof window === 'undefined') return 'USD';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Karachi') return 'PKR';
  } catch {
    // ignore
  }
  return 'USD';
}

/**
 * Format a value (stored in USD) to display string.
 * - USD mode: show as-is with $ prefix
 * - PKR mode: convert to PKR then display
 */
export function formatCompact(value: number | undefined, mode: CurrencyMode, _rate: number): string {
  if (value === undefined || value === null) return '—';

  if (mode === 'PKR') {
    const pkr = value * USD_TO_PKR;
    if (pkr >= 1_000_000) return `PKR ${(pkr / 1_000_000).toFixed(1)}M`;
    if (pkr >= 1_000) return `PKR ${(pkr / 1_000).toFixed(0)}K`;
    return `PKR ${Math.round(pkr).toLocaleString()}`;
  }

  // USD mode — value is already in USD
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Convert a USD-stored value to PKR number */
export function convertValue(usdValue: number, mode: CurrencyMode, _rate: number): number {
  if (mode === 'PKR') return Math.round(usdValue * USD_TO_PKR);
  return usdValue;
}

export function currencySymbol(mode: CurrencyMode): string {
  return mode === 'USD' ? '$' : 'PKR';
}

export function filterCurrencyLabel(mode: CurrencyMode): string {
  return mode === 'USD' ? 'US$' : 'PKR';
}
