import { NextRequest, NextResponse } from 'next/server';

/**
 * Cart API — Database operations are not available on Vercel serverless.
 * Returns 503 for all operations. Cart persistence requires a persistent database.
 */
export async function GET(_request: NextRequest) {
  return NextResponse.json({ items: [] });
}

export async function POST(_request: NextRequest) {
  return NextResponse.json({ error: 'Cart operations are not available on this deployment. Contact the seller directly to purchase.', status: 'unavailable' }, { status: 503 });
}

export async function DELETE(_request: NextRequest) {
  return NextResponse.json({ success: true });
}
