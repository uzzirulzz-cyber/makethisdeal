import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// In-memory cache with TTL
let cachedRate: { rate: number; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const FALLBACK_PKR_TO_USD = 1 / 278; // ~0.0036

async function fetchLiveRate(): Promise<number> {
  try {
    const res = await fetch(
      'https://open.er-api.com/v6/latest/PKR',
      { next: { revalidate: 600 } }
    );
    if (res.ok) {
      const data = await res.json();
      // Base is PKR, so rates.USD = how many USD per 1 PKR (e.g. 0.0036)
      if (data?.rates?.USD && data.rates.USD > 0 && data.rates.USD < 1) {
        return data.rates.USD;
      }
    }
  } catch {
    // fallback
  }

  try {
    const res = await fetch(
      'https://api.exchangerate-api.com/v4/latest/PKR',
      { next: { revalidate: 600 } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data?.rates?.USD && data.rates.USD > 0 && data.rates.USD < 1) {
        return data.rates.USD;
      }
    }
  } catch {
    // fallback
  }

  return FALLBACK_PKR_TO_USD;
}

export async function GET(request: NextRequest) {
  // Return cached rate if still valid
  if (cachedRate && Date.now() - cachedRate.fetchedAt < CACHE_TTL_MS) {
    const r = cachedRate.rate;
    return NextResponse.json({
      pkrToUsd: r,
      usdToPkr: Math.round(1 / r),
      cached: true,
    });
  }

  const rate = await fetchLiveRate();
  cachedRate = { rate, fetchedAt: Date.now() };

  return NextResponse.json({
    pkrToUsd: rate,
    usdToPkr: Math.round(1 / rate),
    cached: false,
  });
}