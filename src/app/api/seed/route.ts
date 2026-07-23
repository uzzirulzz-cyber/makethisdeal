import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { STATIC_PRODUCTS, STATIC_CATEGORIES } from '@/lib/static-products';

/**
 * POST /api/seed — Syncs static products and categories into PostgreSQL.
 * Safe to call multiple times (upserts categories, recreates projects).
 */
export async function POST() {
  try {
    // 1. Ensure seller user exists
    const seller = await db.user.upsert({
      where: { email: 'playbeatdigital@proton.me' },
      update: {},
      create: {
        email: 'playbeatdigital@proton.me',
        name: 'PlayBeat Digital',
        role: 'seller',
        company: 'PlayBeat Digital',
        country: 'Pakistan',
        city: 'Karachi',
        verified: true,
        bio: 'Premium digital asset portfolio — domains, SaaS platforms, and crypto exchange properties.',
      },
    });

    // 2. Upsert categories
    for (const cat of STATIC_CATEGORIES) {
      await db.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, icon: cat.icon, description: cat.description, order: cat.order },
        create: { name: cat.name, slug: cat.slug, icon: cat.icon, description: cat.description, order: cat.order },
      });
    }

    // 3. Delete existing projects (respects FK order)
    await db.cartItem.deleteMany();
    await db.cart.deleteMany();
    await db.orderItem.deleteMany();
    await db.paymentSubmission.deleteMany();
    await db.order.deleteMany();
    await db.offer.deleteMany();
    await db.favorite.deleteMany();
    await db.project.deleteMany();

    // 4. Create all projects from static data
    const created = [];
    for (const p of STATIC_PRODUCTS) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { seller: _seller, _count: _count, ...data } = p as any;
      const project = await db.project.create({
        data: { ...data, sellerId: seller.id },
      });
      created.push({ id: project.id, name: project.name, priceUSD: project.suggestedSellingPrice });
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${created.length} projects into PostgreSQL`,
      seller: { id: seller.id, name: seller.name },
      projects: created,
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const projectCount = await db.project.count();
    const sellerCount = await db.user.count();
    return NextResponse.json({ projects: projectCount, sellers: sellerCount, database: 'postgresql' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
