import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const RATE = 278;
const usd = (m: number) => (m * 1_000_000) / RATE;

let _autoSeeded = false;
async function ensureSeeded() {
  if (_autoSeeded) return;
  _autoSeeded = true;
  const count = await db.project.count();
  if (count > 0) return;
  console.log('[ensureSeeded] Seeding products with USD prices...');
  // Ensure categories exist (FK constraint)
  const catNames: Record<string, string> = { 'domains': 'Domains', 'fintech': 'FinTech', 'digital-products': 'Digital Products', 'websites': 'Websites', 'ai-solutions': 'AI Solutions' };
  for (const [slug, name] of Object.entries(catNames)) {
    await db.category.upsert({ where: { slug }, update: {}, create: { name, slug } });
  }
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
  const items = [
    { name: 'PlayBeat.live', category: 'domains', industry: 'Media & Entertainment', featured: true, suggestedSellingPrice: usd(1.1), buyNowPrice: usd(1.1), investorPrice: usd(0.95), wholesalePrice: usd(0.85), acquisitionPrice: usd(1.3), minimumOffer: usd(0.8), websiteUrl: 'https://playbeat.live', tags: 'domain,live,streaming,music', technologyStack: 'DNS, Web Hosting', businessModel: 'Domain sale', targetMarket: 'Entertainment companies', sellerId: seller.id },
    { name: 'PlayBeat.digital', category: 'domains', industry: 'Digital Services', featured: true, suggestedSellingPrice: usd(1.6), buyNowPrice: usd(1.6), investorPrice: usd(1.4), wholesalePrice: usd(1.25), acquisitionPrice: usd(1.9), minimumOffer: usd(1.2), websiteUrl: 'https://playbeat.digital', tags: 'domain,digital,agency', technologyStack: 'Next.js, React', businessModel: 'Brand sale', targetMarket: 'Digital agencies', sellerId: seller.id },
    { name: 'PlayBeatDigital.world', category: 'domains', industry: 'Media & Entertainment', featured: true, suggestedSellingPrice: usd(1.6), buyNowPrice: usd(1.6), investorPrice: usd(1.4), wholesalePrice: usd(1.25), acquisitionPrice: usd(1.9), minimumOffer: usd(1.2), websiteUrl: 'https://playbeatdigital.world', tags: 'domain,world,global', technologyStack: 'DNS, Web Hosting', businessModel: 'Domain sale', targetMarket: 'Global media companies', sellerId: seller.id },
    { name: 'BlockExchange.buzz', category: 'fintech', industry: 'Cryptocurrency & Blockchain', featured: true, suggestedSellingPrice: usd(0.8), buyNowPrice: usd(0.8), investorPrice: usd(0.7), wholesalePrice: usd(0.6), acquisitionPrice: usd(1.0), minimumOffer: usd(0.6), websiteUrl: 'https://blockexchange.buzz', tags: 'crypto,exchange,blockchain', technologyStack: 'React, Node.js, WebSocket', businessModel: 'Trading fees', targetMarket: 'Crypto traders', monthlyVisitors: 500, sellerId: seller.id },
    { name: 'BrockExchange.quest', category: 'fintech', industry: 'Cryptocurrency & Blockchain', featured: false, suggestedSellingPrice: usd(0.8), buyNowPrice: usd(0.8), investorPrice: usd(0.7), wholesalePrice: usd(0.6), acquisitionPrice: usd(1.0), minimumOffer: usd(0.6), websiteUrl: 'https://brockexchange.quest', tags: 'crypto,exchange,trading', technologyStack: 'React, Node.js', businessModel: 'Trading fees', targetMarket: 'Retail traders', monthlyVisitors: 300, sellerId: seller.id },
    { name: 'BuzzCryp.buzz', category: 'fintech', industry: 'Cryptocurrency & Blockchain', featured: false, suggestedSellingPrice: usd(0.8), buyNowPrice: usd(0.8), investorPrice: usd(0.7), wholesalePrice: usd(0.6), acquisitionPrice: usd(1.0), minimumOffer: usd(0.6), websiteUrl: 'https://buzzcryp.buzz', tags: 'crypto,news,community', technologyStack: 'Next.js, Tailwind CSS', businessModel: 'Ads, subscriptions', targetMarket: 'Crypto community', monthlyVisitors: 400, sellerId: seller.id },
    { name: 'NexTradePro.top', category: 'fintech', industry: 'Technology', featured: false, suggestedSellingPrice: usd(0.8), buyNowPrice: usd(0.8), investorPrice: usd(0.7), wholesalePrice: usd(0.6), acquisitionPrice: usd(1.0), minimumOffer: usd(0.6), websiteUrl: 'https://nextradepro.top', tags: 'trading,fintech,crypto', technologyStack: 'Next.js, TypeScript', businessModel: 'SaaS subscription', targetMarket: 'Traders, startups', sellerId: seller.id },
    { name: 'PlayBeatTV.buzz', category: 'domains', industry: 'Media & Entertainment', featured: true, suggestedSellingPrice: usd(1.1), buyNowPrice: usd(1.1), investorPrice: usd(0.95), wholesalePrice: usd(0.85), acquisitionPrice: usd(1.3), minimumOffer: usd(0.8), websiteUrl: 'https://playbeattv.buzz', tags: 'streaming,tv,video', technologyStack: 'React, Node.js, CDN', businessModel: 'Streaming platform', targetMarket: 'Media companies', sellerId: seller.id },
    { name: 'MagxTV', category: 'digital-products', industry: 'Media & Entertainment', featured: false, suggestedSellingPrice: usd(0.8), buyNowPrice: usd(0.8), investorPrice: usd(0.7), wholesalePrice: usd(0.6), acquisitionPrice: usd(1.0), minimumOffer: usd(0.5), websiteUrl: 'https://magxtv.click', tags: 'media,tv,content', technologyStack: 'Next.js, CMS', businessModel: 'Content platform', targetMarket: 'Content creators', sellerId: seller.id },
    { name: 'Malik Indol', category: 'websites', industry: 'Technology', featured: true, suggestedSellingPrice: usd(1.7), buyNowPrice: usd(1.7), investorPrice: usd(1.5), wholesalePrice: usd(1.3), acquisitionPrice: usd(2.0), minimumOffer: usd(1.3), websiteUrl: 'https://malik-indol-six.vercel.app', demoUrl: 'https://malik-indol-six.vercel.app', tags: 'saas,webapp,vercel', technologyStack: 'Next.js, React, TypeScript, Vercel', businessModel: 'SaaS platform', targetMarket: 'Enterprise, B2B', monthlyVisitors: 1000, sourceCodeAvailable: true, sellerId: seller.id },
    { name: 'ZXC Sigma Ivory', category: 'websites', industry: 'Technology', featured: true, suggestedSellingPrice: usd(1.4), buyNowPrice: usd(1.4), investorPrice: usd(1.2), wholesalePrice: usd(1.1), acquisitionPrice: usd(1.7), minimumOffer: usd(1.0), websiteUrl: 'https://zxc-sigma-ivory.vercel.app', demoUrl: 'https://zxc-sigma-ivory.vercel.app', tags: 'saas,webapp,vercel', technologyStack: 'Next.js, React, TypeScript, Vercel', businessModel: 'SaaS / Productivity', targetMarket: 'Business professionals', monthlyVisitors: 750, sourceCodeAvailable: true, sellerId: seller.id },
    { name: 'Z.ai Chat Session', category: 'ai-solutions', industry: 'Artificial Intelligence', featured: true, suggestedSellingPrice: usd(1.4), buyNowPrice: usd(1.4), investorPrice: usd(1.2), wholesalePrice: usd(1.1), acquisitionPrice: usd(1.7), minimumOffer: usd(1.0), websiteUrl: 'https://chat.z.ai/s/18a85e06-2621-46ea-a8b7-b7ffec369ac5', tags: 'ai,chat,machine-learning', technologyStack: 'AI/ML, WebSocket, React', businessModel: 'AI service', targetMarket: 'AI companies, developers', monthlyVisitors: 2000, sellerId: seller.id },
  ];
  for (const p of items) {
    await db.project.create({ data: { ...p, status: 'active', visibility: 'public', country: 'Pakistan' } });
  }
  console.log(`[ensureSeeded] Done - ${items.length} products seeded`);
}

export async function GET(request: NextRequest) {
  try {
    try { await ensureSeeded(); } catch (_seedErr) { /* non-blocking */ }
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
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.category) {
      await db.category.upsert({
        where: { slug: body.category },
        update: {},
        create: { name: body.categoryName || body.category, slug: body.category, icon: body.categoryIcon || undefined, description: body.categoryDescription || undefined },
      });
    }
    const project = await db.project.create({
      data: { ...body, status: 'active', visibility: 'public', featured: false },
      include: { seller: { select: { id: true, name: true, company: true, country: true, avatar: true, verified: true } } },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
