import { NextRequest, NextResponse } from 'next/server';

/**
 * Payment Verify API — Admin endpoint, database not available on Vercel.
 */
export async function POST(_request: NextRequest) {
  return NextResponse.json({ error: 'Payment verification not available on this deployment' }, { status: 503 });
}
