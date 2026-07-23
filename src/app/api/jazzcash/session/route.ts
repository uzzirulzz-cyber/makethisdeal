import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createJazzCashSession } from '@/lib/jazzcash';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amountPkr, email, name, description, orderId } = body;

    if (!amountPkr || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: amountPkr, email' },
        { status: 400 }
      );
    }

    const session = createJazzCashSession({ amountPkr, email, name, description, orderId });

    if (!session) {
      return NextResponse.json(
        { error: 'JazzCash is not configured. Please choose another payment method.' },
        { status: 400 }
      );
    }

    await db.paymentSubmission.create({
      data: {
        method: 'jazzcash',
        amountPkr,
        email,
        name: name || null,
        description: description || null,
        transactionRef: session.postData.pp_TxnRefNo,
        orderId: orderId || null,
        status: 'pending',
      },
    });

    return NextResponse.json({
      postData: session.postData,
      apiUrl: session.apiUrl,
    });
  } catch (error) {
    console.error('JazzCash session error:', error);
    return NextResponse.json({ error: 'Failed to create JazzCash session' }, { status: 500 });
  }
}