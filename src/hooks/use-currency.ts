'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/use-app-store';
import {
  type CurrencyMode,
  formatCompact,
  convertValue,
  currencySymbol,
  filterCurrencyLabel,
} from '@/lib/currency';

/**
 * Central hook for currency-aware formatting.
 * - Auto-fetches live PKR→USD exchange rate on mount
 * - Auto-detects region (PKR for Pakistan timezone, USD elsewhere)
 * - Exposes `formatPrice(pkrValue)` that returns a compact string
 *   in the active currency.
 */
export function useCurrency() {
  const mode = useAppStore((s) => s.currencyMode);
  const pkrToUsd = useAppStore((s) => s.pkrToUsd);
  const setExchangeRate = useAppStore((s) => s.setExchangeRate);
  const toggleCurrency = useAppStore((s) => s.toggleCurrency);

  // Fetch live rate on mount
  useEffect(() => {
    async function loadRate() {
      try {
        const res = await fetch('/api/exchange-rate');
        if (res.ok) {
          const data = await res.json();
          if (data.pkrToUsd) setExchangeRate(data.pkrToUsd);
        }
      } catch {
        // keep fallback rate
      }
    }
    loadRate();
  }, [setExchangeRate]);

  /** Format a PKR-stored value into the active currency compact string */
  function formatPrice(value: number | undefined): string {
    return formatCompact(value, mode, pkrToUsd);
  }

  /** Convert a PKR value to the active currency raw number */
  function convert(pkrValue: number): number {
    return convertValue(pkrValue, mode, pkrToUsd);
  }

  /** Current currency symbol */
  const symbol = currencySymbol(mode);

  /** Label for filter inputs (PKR or US$) */
  const filterLabel = filterCurrencyLabel(mode);

  /** Rate display string */
  const rateDisplay = mode === 'USD'
    ? `1 US$ ≈ PKR ${Math.round(1 / pkrToUsd).toLocaleString()}`
    : `1 PKR ≈ US$ ${pkrToUsd.toFixed(4)}`;

  return {
    mode,
    symbol,
    formatPrice,
    convert,
    filterLabel,
    rateDisplay,
    toggleCurrency,
  };
}