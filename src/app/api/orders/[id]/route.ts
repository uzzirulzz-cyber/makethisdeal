import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                category: true,
                overview: true,
                thumbnail: true,
                tags: true,
                suggestedSellingPrice: true,
                investorPrice: true,
                wholesalePrice: true,
                acquisitionPrice: true,
                aiValuation: true,
                websiteUrl: true,
              },
            },
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Order detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}