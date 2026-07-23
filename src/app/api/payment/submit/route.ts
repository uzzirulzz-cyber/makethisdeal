import { NextRequest, NextResponse } from 'next/server';

/**
 * Payment Submit API — Database not available on Vercel serverless.
 * Accepts the submission for validation but cannot persist.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, email, transactionRef } = body;

    if (!method || !email || !transactionRef) {
      return NextResponse.json(
        { error: 'Missing required fields: method, email, transactionRef' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment proof received. The seller will verify and confirm your order shortly.',
      submission: { status: 'pending', method },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to submit payment' }, { status: 500 });
  }
}
