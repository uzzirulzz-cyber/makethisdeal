import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyJazzCashCallback } from '@/lib/jazzcash';

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);

    const isValid = verifyJazzCashCallback(params);

    const txnRef = params.pp_TxnRefNo || params.pp_BillReference;
    if (!txnRef) {
      return NextResponse.redirect(new URL('/?payment=failed', request.url));
    }

    const submission = await db.paymentSubmission.findFirst({
      where: { transactionRef: txnRef },
    });

    if (!submission) {
      return NextResponse.redirect(new URL('/?payment=failed', request.url));
    }

    const newStatus = isValid ? 'confirmed' : 'rejected';

    await db.paymentSubmission.update({
      where: { id: submission.id },
      data: {
        status: newStatus,
        verifiedAt: new Date(),
        adminNote: isValid ? 'Auto-verified via JazzCash callback' : 'JazzCash hash verification failed',
      },
    });

    if (submission.orderId) {
      await db.order.update({
        where: { id: submission.orderId },
        data: {
          paymentStatus: newStatus,
          status: newStatus,
          transactionRef: params.pp_TxnRefNo || null,
        },
      });
    }

    if (isValid) {
      return NextResponse.redirect(new URL('/?payment=success', request.url));
    } else {
      return NextResponse.redirect(new URL('/?payment=failed', request.url));
    }
  } catch (error) {
    console.error('JazzCash callback error:', error);
    return NextResponse.redirect(new URL('/?payment=failed', request.url));
  }
}