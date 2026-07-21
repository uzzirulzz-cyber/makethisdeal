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
    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const orders = await db.order.findMany({
      where: status ? { status } : undefined,
      include: {
        items: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                category: true,
                thumbnail: true,
              },
            },
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders list error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}