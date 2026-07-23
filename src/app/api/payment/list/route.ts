import { NextRequest, NextResponse } from 'next/server';

/**
 * Payment List API — Admin endpoint, database not available on Vercel.
 */
export async function GET(_request: NextRequest) {
  return NextResponse.json({ payments: [] });
}
