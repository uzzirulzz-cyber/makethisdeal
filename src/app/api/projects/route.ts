import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category') || '';
    const country = searchParams.get('country') || '';
    const query = searchParams.get('query') || '';
    const businessStage = searchParams.get('businessStage') || '';
    const priceMin = searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined;
    const priceMax = searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined;
    const revenueMin = searchParams.get('revenueMin') ? parseFloat(searchParams.get('revenueMin')!) : undefined;
    const revenueMax = searchParams.get('revenueMax') ? parseFloat(searchParams.get('revenueMax')!) : undefined;
    const roiMin = searchParams.get('roiMin') ? parseFloat(searchParams.get('roiMin')!) : undefined;
    const sortBy = searchParams.get('sortBy') || 'newest';

    const where: any = { status: 'active', visibility: 'public' };

    if (category) where.category = category;
    if (country) where.country = country;
    if (businessStage) where.businessStage = businessStage;
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { overview: { contains: query } },
        { tags: { contains: query } },
        { industry: { contains: query } },
        { country: { contains: query } },
      ];
    }
    if (priceMin !== undefined || priceMax !== undefined) {
      where.suggestedSellingPrice = {};
      if (priceMin !== undefined) where.suggestedSellingPrice.gte = priceMin;
      if (priceMax !== undefined) where.suggestedSellingPrice.lte = priceMax;
    }
    if (revenueMin !== undefined || revenueMax !== undefined) {
      where.annualRevenue = {};
      if (revenueMin !== undefined) where.annualRevenue.gte = revenueMin;
      if (revenueMax !== undefined) where.annualRevenue.lte = revenueMax;
    }
    if (roiMin !== undefined) {
      where.expectedROI = { gte: roiMin };
    }

    const orderBy: any = {};
    switch (sortBy) {
      case 'price_low': orderBy.suggestedSellingPrice = 'asc'; break;
      case 'price_high': orderBy.suggestedSellingPrice = 'desc'; break;
      case 'roi_high': orderBy.expectedROI = 'desc'; break;
      case 'revenue_high': orderBy.annualRevenue = 'desc'; break;
      case 'popular': orderBy.monthlyVisitors = 'desc'; break;
      default: orderBy.createdAt = 'desc';
    }

    const [projects, total] = await Promise.all([
      db.project.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          seller: { select: { id: true, name: true, company: true, country: true, avatar: true, verified: true } },
          _count: { select: { offers: true, favorites: true } },
        },
      }),
      db.project.count({ where }),
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Ensure the category exists in DB (FK constraint)
    if (body.category) {
      await db.category.upsert({
        where: { slug: body.category },
        update: {},
        create: {
          name: body.categoryName || body.category,
          slug: body.category,
          icon: body.categoryIcon || undefined,
          description: body.categoryDescription || undefined,
        },
      });
    }
    const project = await db.project.create({
      data: {
        ...body,
        status: 'active',
        visibility: 'public',
        featured: false,
      },
      include: {
        seller: { select: { id: true, name: true, company: true, country: true, avatar: true, verified: true } },
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}