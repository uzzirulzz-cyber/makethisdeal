import { NextRequest, NextResponse } from 'next/server';

/**
 * Checkout API — Database operations are not available on Vercel serverless.
 * Returns 503. Checkout requires a persistent database.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate input
    const { buyerName, buyerEmail } = body;
    if (!buyerName || !buyerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Checkout is not available on this deployment. Contact the seller directly to complete your purchase.', status: 'unavailable' },
      { status: 503 }
    );
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
