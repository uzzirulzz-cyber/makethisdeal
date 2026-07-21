import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateOrderNumber } from '@/lib/payment-methods';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, buyerName, buyerEmail, currencyMode, exchangeRate, totalDisplay } = body;

    if (!sessionId || !buyerName || !buyerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cart = await db.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: { project: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const totalPkr = cart.items.reduce((sum, item) => sum + item.pricePkr, 0);
    const orderNumber = generateOrderNumber();

    const order = await db.order.create({
      data: {
        orderNumber,
        buyerName,
        buyerEmail,
        totalPkr,
        currencyMode: currencyMode || 'PKR',
        exchangeRate: exchangeRate ?? null,
        totalDisplay: totalDisplay ?? null,
        items: {
          create: cart.items.map((item) => ({
            projectId: item.projectId,
            projectName: item.project.name,
            pricePkr: item.pricePkr,
          })),
        },
      },
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
      },
    });

    await db.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalPkr: order.totalPkr,
        currencyMode: order.currencyMode,
        exchangeRate: order.exchangeRate,
        totalDisplay: order.totalDisplay,
        status: order.status,
        items: order.items,
      },
    });
  } catch (error) {
    console.error('Checkout POST error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}