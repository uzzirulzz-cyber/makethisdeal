import { NextRequest, NextResponse } from 'next/server';

/**
 * JazzCash Session API — Database not available on Vercel.
 * JazzCash also requires env vars (JAZZCASH_PASSWORD, JAZZCASH_INTEGRITY_SALT).
 */
export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { error: 'JazzCash is not available on this deployment. Please use Bank Transfer or Easypaisa.' },
    { status: 503 }
  );
}
