import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    // Create seller user
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

    const projects = [
      {
        name: 'PlayBeat Live',
        category: 'domains',
        categoryName: 'Domains',
        categoryIcon: 'Globe',
        industry: 'Media & Entertainment',
        country: 'Pakistan',
        businessStage: 'growth',
        status: 'active',
        visibility: 'public',
        featured: true,
        overview: 'Premium .live domain ideal for live streaming, music, and entertainment platforms. PlayBeat Live carries strong brand recognition in the digital media space.',
        businessModel: 'Domain leasing or sale for live streaming / music platform',
        targetMarket: 'Entertainment & Media companies, Live streaming startups',
        technologyStack: 'DNS, Web Hosting',
        suggestedSellingPrice: 1100000,
        buyNowPrice: 1100000,
        websiteUrl: 'https://playbeat.live',
        tags: 'domain, live, streaming, music, entertainment',
        sellerId: seller.id,
      },
      {
        name: 'PlayBeat Digital',
        category: 'websites',
        categoryName: 'Websites',
        categoryIcon: 'Globe2',
        industry: 'Digital Services',
        country: 'Pakistan',
        businessStage: 'growth',
        status: 'active',
        visibility: 'public',
        featured: true,
        overview: 'PlayBeat Digital is a premium digital services brand with an established web presence. The domain and brand are ideal for a digital agency, marketing firm, or tech services company.',
        businessModel: 'Digital services agency or brand sale',
        targetMarket: 'Digital agencies, Marketing companies, Tech startups',
        technologyStack: 'Next.js, React, Node.js',
        suggestedSellingPrice: 1600000,
        buyNowPrice: 1600000,
        websiteUrl: 'https://playbeat.digital',
        tags: 'website, digital, agency, services, brand',
        sellerId: seller.id,
      },
      {
        name: 'PlayBeat Digital World',
        category: 'domains',
        categoryName: 'Domains',
        categoryIcon: 'Globe',
        industry: 'Media & Entertainment',
        country: 'Pakistan',
        businessStage: 'startup',
        status: 'active',
        visibility: 'public',
        featured: false,
        overview: 'Premium .world domain extension for the PlayBeat Digital brand. Excellent for global expansion of any digital media or entertainment venture.',
        businessModel: 'Domain leasing or sale for global digital brand',
        targetMarket: 'Global media companies, Entertainment platforms',
        technologyStack: 'DNS, Web Hosting',
        suggestedSellingPrice: 1600000,
        buyNowPrice: 1600000,
        websiteUrl: 'https://playbeatdigital.world',
        tags: 'domain, world, global, digital, media',
        sellerId: seller.id,
      },
      {
        name: 'BlockExchange',
        category: 'fintech',
        categoryName: 'FinTech',
        categoryIcon: 'Landmark',
        industry: 'Cryptocurrency & Blockchain',
        country: 'Pakistan',
        businessStage: 'startup',
        status: 'active',
        visibility: 'public',
        featured: false,
        overview: 'BlockExchange is a cryptocurrency exchange platform built for trading digital assets. Features include real-time market data, secure wallet integration, and a modern trading interface.',
        businessModel: 'Cryptocurrency exchange trading fees',
        targetMarket: 'Crypto traders, Blockchain enthusiasts, DeFi users',
        technologyStack: 'React, Node.js, WebSocket, PostgreSQL',
        suggestedSellingPrice: 800000,
        buyNowPrice: 800000,
        websiteUrl: 'https://blockexchange.buzz',
        tags: 'crypto, exchange, blockchain, trading, defi',
        monthlyVisitors: 500,
        sellerId: seller.id,
      },
      {
        name: 'BrockExchange',
        category: 'fintech',
        categoryName: 'FinTech',
        categoryIcon: 'Landmark',
        industry: 'Cryptocurrency & Blockchain',
        country: 'Pakistan',
        businessStage: 'startup',
        status: 'active',
        visibility: 'public',
        featured: false,
        overview: 'BrockExchange is a crypto trading platform with a focus on user-friendly experience and fast transaction processing. Built with modern web technologies for optimal performance.',
        businessModel: 'Crypto exchange with trading fees and premium features',
        targetMarket: 'Retail crypto traders, Beginner to intermediate users',
        technologyStack: 'React, Node.js, REST API, MongoDB',
        suggestedSellingPrice: 800000,
        buyNowPrice: 800000,
        websiteUrl: 'https://brockexchange.quest',
        tags: 'crypto, exchange, trading, blockchain, finance',
        monthlyVisitors: 300,
        sellerId: seller.id,
      },
      {
        name: 'BuzzCryp',
        category: 'fintech',
        categoryName: 'FinTech',
        categoryIcon: 'Landmark',
        industry: 'Cryptocurrency & Blockchain',
        country: 'Pakistan',
        businessStage: 'startup',
        status: 'active',
        visibility: 'public',
        featured: false,
        overview: 'BuzzCryp is a trending crypto news and community platform. Features real-time price tracking, market analysis, and community discussions for cryptocurrency enthusiasts.',
        businessModel: 'Advertising, Premium subscriptions, Affiliate referrals',
        targetMarket: 'Crypto community, News readers, Market analysts',
        technologyStack: 'Next.js, Tailwind CSS, Firebase',
        suggestedSellingPrice: 800000,
        buyNowPrice: 800000,
        websiteUrl: 'https://buzzcryp.buzz',
        tags: 'crypto, news, community, blockchain, defi',
        monthlyVisitors: 400,
        sellerId: seller.id,
      },
      {
        name: 'NextraDePro',
        category: 'startups',
        categoryName: 'Startups',
        categoryIcon: 'Rocket',
        industry: 'Technology',
        country: 'Pakistan',
        businessStage: 'startup',
        status: 'active',
        visibility: 'public',
        featured: false,
        overview: 'NextraDePro is a professional networking and development platform. Combines project management tools with professional networking features for tech teams.',
        businessModel: 'SaaS subscription model',
        targetMarket: 'Tech teams, Developers, Project managers, Startups',
        technologyStack: 'Next.js, TypeScript, Prisma, PostgreSQL',
        suggestedSellingPrice: 800000,
        buyNowPrice: 800000,
        websiteUrl: 'https://nextradepro.top',
        tags: 'startup, saas, networking, development, project-management',
        sellerId: seller.id,
      },
      {
        name: 'PlayBeat TV',
        category: 'digital-products',
        categoryName: 'Digital Products',
        categoryIcon: 'FileText',
        industry: 'Media & Entertainment',
        country: 'Pakistan',
        businessStage: 'growth',
        status: 'active',
        visibility: 'public',
        featured: true,
        overview: 'PlayBeat TV is a digital streaming brand with premium domain presence. Ideal for video streaming, live broadcasting, or IPTV services. Strong brand name in the entertainment space.',
        businessModel: 'Streaming platform or media brand licensing',
        targetMarket: 'Streaming services, Media companies, Content creators',
        technologyStack: 'React, Node.js, CDN, Video Streaming',
        suggestedSellingPrice: 1100000,
        buyNowPrice: 1100000,
        websiteUrl: 'https://playbeattv.buzz',
        tags: 'streaming, tv, video, media, entertainment, brand',
        sellerId: seller.id,
      },
      {
        name: 'Magx TV',
        category: 'digital-products',
        categoryName: 'Digital Products',
        categoryIcon: 'FileText',
        industry: 'Media & Entertainment',
        country: 'Pakistan',
        businessStage: 'idea',
        status: 'active',
        visibility: 'public',
        featured: false,
        overview: 'Magx TV is a digital media brand with a premium .click domain. Suitable for a magazine-style video platform, digital publication, or creative content hub. Contact for pricing.',
        businessModel: 'Content platform or media brand',
        targetMarket: 'Content creators, Digital publishers, Media startups',
        technologyStack: 'Next.js, CMS, CDN',
        websiteUrl: 'https://magxtv.click',
        tags: 'media, tv, magazine, content, digital, brand',
        sellerId: seller.id,
      },
      {
        name: 'Malik Indol',
        category: 'saas',
        categoryName: 'SaaS',
        categoryIcon: 'Laptop',
        industry: 'Technology',
        country: 'Pakistan',
        businessStage: 'growth',
        status: 'active',
        visibility: 'public',
        featured: true,
        overview: 'Malik Indol is a full-featured web application deployed on Vercel. A complete SaaS-ready platform with modern UI, authentication, and scalable architecture ready for production use.',
        businessModel: 'SaaS platform with subscription model',
        targetMarket: 'Enterprise clients, Tech companies, B2B SaaS market',
        technologyStack: 'Next.js, React, TypeScript, Vercel, Tailwind CSS',
        suggestedSellingPrice: 1700000,
        buyNowPrice: 1700000,
        websiteUrl: 'https://malik-indol-six.vercel.app',
        tags: 'saas, web-app, vercel, nextjs, production-ready',
        monthlyVisitors: 1000,
        sellerId: seller.id,
      },
      {
        name: 'ZXC Sigma Ivory',
        category: 'saas',
        categoryName: 'SaaS',
        categoryIcon: 'Laptop',
        industry: 'Technology',
        country: 'Pakistan',
        businessStage: 'growth',
        status: 'active',
        visibility: 'public',
        featured: false,
        overview: 'ZXC Sigma Ivory is a modern web application hosted on Vercel. Features a clean, professional design with robust functionality suitable for business or productivity use cases.',
        businessModel: 'SaaS / Productivity tool',
        targetMarket: 'Business professionals, Productivity seekers, SMEs',
        technologyStack: 'Next.js, React, TypeScript, Vercel',
        suggestedSellingPrice: 1400000,
        buyNowPrice: 1400000,
        websiteUrl: 'https://zxc-sigma-ivory.vercel.app',
        tags: 'saas, web-app, vercel, productivity, business',
        monthlyVisitors: 750,
        sellerId: seller.id,
      },
      {
        name: 'Z.ai Chat Session',
        category: 'ai-solutions',
        categoryName: 'AI Solutions',
        categoryIcon: 'Brain',
        industry: 'Artificial Intelligence',
        country: 'Pakistan',
        businessStage: 'growth',
        status: 'active',
        visibility: 'public',
        featured: true,
        overview: 'An AI-powered chat session built on the Z.ai platform. Demonstrates advanced conversational AI capabilities with context-aware responses and intelligent dialogue management.',
        businessModel: 'AI chat service / API access licensing',
        targetMarket: 'AI companies, Customer service providers, Developers',
        technologyStack: 'AI/ML, WebSocket, React, Node.js',
        suggestedSellingPrice: 1400000,
        buyNowPrice: 1400000,
        websiteUrl: 'https://chat.z.ai/s/18a85e06-2621-46ea-a8b7-b7ffec369ac5',
        tags: 'ai, chat, conversational, machine-learning, z-ai',
        monthlyVisitors: 2000,
        sellerId: seller.id,
      },
    ];

    // Ensure categories exist
    const categoryMap: Record<string, { name: string; icon: string }> = {};
    for (const p of projects) {
      if (p.category && !categoryMap[p.category]) {
        categoryMap[p.category] = {
          name: (p as any).categoryName || p.category,
          icon: (p as any).categoryIcon || undefined,
        };
      }
    }
    for (const [slug, data] of Object.entries(categoryMap)) {
      await db.category.upsert({
        where: { slug },
        update: {},
        create: { name: data.name, slug, icon: data.icon },
      });
    }

    // Delete existing projects (clean seed)
    const existingCount = await db.project.count();
    if (existingCount > 0) {
      await db.project.deleteMany({});
    }

    // Create all projects
    const created = [];
    for (const p of projects) {
      const { categoryName: _cn, categoryIcon: _ci, ...data } = p;
      const project = await db.project.create({ data });
      created.push(project);
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${created.length} projects successfully`,
      seller: { id: seller.id, name: seller.name },
      projects: created.map((p) => ({ id: p.id, name: p.name, price: p.suggestedSellingPrice })),
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const count = await db.project.count();
  const sellers = await db.user.count();
  return NextResponse.json({ projects: count, sellers });
}