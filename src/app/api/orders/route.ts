import { NextRequest, NextResponse } from 'next/server';

/**
 * Orders API — Database not available on Vercel serverless.
 * Returns empty list for admin requests.
 */
export async function GET(_request: NextRequest) {
  return NextResponse.json({ orders: [] });
}
