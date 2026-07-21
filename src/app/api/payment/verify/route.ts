import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdminSecretValid } from '@/lib/payment-methods';

export async function POST(request: NextRequest) {
  try {
    const adminSecret = request.headers.get('x-admin-secret');
    if (!adminSecret || !isAdminSecretValid(adminSecret)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, action, adminNote } = body;

    if (!id || !action || !['confirm', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request. Provide id and action (confirm/reject)' }, { status: 400 });
    }

    const newStatus = action === 'confirm' ? 'confirmed' : 'rejected';

    const updated = await db.paymentSubmission.update({
      where: { id },
      data: {
        status: newStatus,
        verifiedAt: new Date(),
        adminNote: adminNote || null,
      },
    });

    if (updated.orderId) {
      await db.order.update({
        where: { id: updated.orderId },
        data: {
          paymentStatus: newStatus,
          status: newStatus,
        },
      });
    }

    return NextResponse.json({ success: true, payment: updated });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}