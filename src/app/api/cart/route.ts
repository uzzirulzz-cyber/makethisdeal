import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    if (!sessionId) {
      return NextResponse.json({ items: [] });
    }

    const cart = await db.cart.findUnique({
      where: { sessionId },
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
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({ items: cart?.items ?? [] });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, projectId, pricePkr, priceType } = body;

    if (!sessionId || !projectId || pricePkr == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cart = await db.cart.upsert({
      where: { sessionId },
      create: { sessionId },
      update: {},
    });

    const cartItem = await db.cartItem.upsert({
      where: {
        cartId_projectId: { cartId: cart.id, projectId },
      },
      create: {
        cartId: cart.id,
        projectId,
        pricePkr,
        priceType: priceType || 'suggestedSellingPrice',
      },
      update: {
        pricePkr,
        priceType: priceType || 'suggestedSellingPrice',
      },
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
    });

    return NextResponse.json({ item: cartItem });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const itemId = request.nextUrl.searchParams.get('itemId');
    if (!itemId) {
      return NextResponse.json({ error: 'Missing itemId' }, { status: 400 });
    }

    await db.cartItem.delete({ where: { id: itemId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
}
