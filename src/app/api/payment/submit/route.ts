import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, amountPkr, email, name, description, transactionRef, note, orderId } = body;

    if (!method || !amountPkr || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: method, amountPkr, email' },
        { status: 400 }
      );
    }

    if (!transactionRef) {
      return NextResponse.json(
        { error: 'Missing transaction reference' },
        { status: 400 }
      );
    }

    const submission = await db.paymentSubmission.create({
      data: {
        method,
        amountPkr,
        email,
        name: name || null,
        description: description || null,
        transactionRef,
        note: note || null,
        orderId: orderId || null,
        status: 'pending',
      },
    });

    if (orderId) {
      await db.order.update({
        where: { id: orderId },
        data: {
          paymentMethod: method,
          paymentStatus: 'pending',
          transactionRef,
        },
      });
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        status: submission.status,
        method: submission.method,
        amountPkr: submission.amountPkr,
      },
    });
  } catch (error) {
    console.error('Payment submit error:', error);
    return NextResponse.json({ error: 'Failed to submit payment' }, { status: 500 });
  }
}