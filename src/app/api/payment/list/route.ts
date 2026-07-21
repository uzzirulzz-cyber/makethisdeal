import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdminSecretValid } from '@/lib/payment-methods';

export async function GET(request: NextRequest) {
  try {
    const adminSecret = request.headers.get('x-admin-secret');
    if (!adminSecret || !isAdminSecretValid(adminSecret)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const payments = await db.paymentSubmission.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Payment list error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}