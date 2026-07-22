import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const SELLER_ID = 'cmrr9mai50000r1mb4q09uknx';

async function seed() {
  console.log('🌱 Seeding MakeThisDeal database...\n');

  // 1. Create seller user
  const seller = await db.user.upsert({
    where: { id: SELLER_ID },
    update: {},
    create: {
      id: SELLER_ID,
      email: 'admin@makethisdeal.com',
      name: 'MakeThisDeal Official',
      role: 'admin',
      company: 'MakeThisDeal',
      country: 'Pakistan',
      verified: true,
    },
  });
  console.log(`✅ Seller: ${seller.name} (${seller.email})`);

  // 2. Create categories
  const categories = await Promise.all([
    db.category.upsert({
      where: { slug: 'domains' },
      update: {},
      create: { name: 'Domains', slug: 'domains', icon: 'Globe', description: 'Premium domains & digital real estate', order: 1 },
    }),
    db.category.upsert({
      where: { slug: 'websites' },
      update: {},
      create: { name: 'Websites', slug: 'websites', icon: 'Globe2', description: 'Established websites & web properties', order: 2 },
    }),
  ]);
  console.log(`✅ Categories: ${categories.map(c => c.name).join(', ')}`);

  // 3. Create all 13 projects
  const projects = [
    {
      name: 'playbeat.live',
      category: 'domains',
      industry: 'Music & Entertainment',
      country: 'Pakistan',
      city: 'Karachi',
      businessStage: 'growth',
      featured: true,
      overview: `**playbeat.live** is a fully operational Live IPTV Streaming platform built with Next.js, MongoDB, and HLS.js. The platform delivers 11,000+ live TV channels across 127+ categories including news, sports, movies, and entertainment with 24/7 auto-refresh capability.

**Live Platform Features:**
- 11,000+ live channels with instant channel switching and zero distortion
- HLS.js powered premium streaming with auto-recovery from network errors
- Low-latency mode with smooth buffering for rock-solid stability
- Favorites system with cross-session sync for signed-in users
- Channel search, category browsing, and admin catalog management
- Responsive modern UI with dark theme design`,
      businessModel: 'Domain resale / Platform development for live music streaming, event ticketing, or audio content distribution',
      targetMarket: 'Music streaming platforms, live event companies, DJ/artist booking services, podcast networks, and entertainment startups in Pakistan, South Asia, and global markets',
      revenueModel: 'Platform subscription, ticket commissions, advertising, premium domain resale',
      growthOpportunity: 'The global music streaming market is projected to reach $76.9B by 2027. Pakistan\'s youth-driven music scene and growing digital entertainment consumption make this an ideal market entry point.',
      competitiveAdvantage: 'Premium two-word .live domain with instant brand recognition. The play+beat combination is intuitive for music/entertainment, reducing marketing costs significantly.',
      suggestedSellingPrice: 1200000,
      minimumOffer: 840000,
      buyNowPrice: 1200000,
      aiValuation: 1140000,
      websiteUrl: 'https://playbeat.live',
      technologyStack: 'Next.js, React, Node.js, WebRTC for live streaming, PostgreSQL',
      thumbnail: '/thumbnails/playbeat-live.png',
      tags: 'music, streaming, live, entertainment, DJ, events, domain, premium, audio, platform',
    },
    {
      name: 'playbeat.digital',
      category: 'domains',
      industry: 'Digital Media & Entertainment',
      country: 'Pakistan',
      city: 'Karachi',
      businessStage: 'growth',
      featured: true,
      overview: `**playbeat.digital** is Pakistan's premier digital products marketplace — a fully functional e-commerce platform offering 500+ subscriptions across 50+ platforms including streaming services, gaming passes, AI tools, and cloud plans.

**Platform Features:**
- 500+ verified digital subscriptions from 50+ platforms worldwide
- Region-unlocked products with instant delivery in under 60 seconds
- Categories: Games, Gift Cards, Software, AI Tools, Subscriptions
- Supported platforms: PUBG, Call of Duty, Free Fire, Steam, and 50+ more
- Secure checkout via Bank Alfalah Payment Gateway (Visa, Mastercard)
- 12,000+ verified customers worldwide across every region
- Affiliate hub with analytics dashboard for resellers
- 52+ live products, 7 game categories, 24/7 customer support`,
      businessModel: 'Digital products marketplace, SaaS music production tools, digital agency branding, or creative technology platform',
      targetMarket: 'Music production software companies, digital creative agencies, SaaS startups, entertainment technology firms, and content creation platforms',
      revenueModel: 'SaaS subscriptions, digital product sales, licensing, advertising',
      growthOpportunity: 'The digital creator economy is valued at over $104B globally. Pakistan\'s IT exports crossed $2.6B in 2023 with strong growth trajectory.',
      competitiveAdvantage: 'Part of a cohesive PlayBeat domain portfolio. The .digital extension clearly communicates the tech/digital nature of the business.',
      suggestedSellingPrice: 1700000,
      minimumOffer: 1300000,
      buyNowPrice: 1700000,
      aiValuation: 760000,
      websiteUrl: 'https://playbeat.digital',
      technologyStack: 'Next.js, React, Python, Web Audio API, Cloudflare, Vercel',
      thumbnail: '/thumbnails/playbeat-digital.png',
      tags: 'digital, music, SaaS, creative, production, tools, domain, technology, media, entertainment',
    },
    {
      name: 'playbeatdigital.world',
      category: 'websites',
      industry: 'Music & Digital Entertainment',
      country: 'Pakistan',
      city: 'Karachi',
      businessStage: 'growth',
      featured: true,
      overview: `**playbeatdigital.world** is the flagship PlayBeat Digital Store — a comprehensive digital marketplace for gaming top-ups, gift cards, and digital subscriptions with instant worldwide delivery.

**Platform Features:**
- Gaming top-ups for PUBG Mobile, Call of Duty, Free Fire, LoL Wild Rift, Mobile Legends, Steam Wallet
- Gift cards and digital subscriptions delivered instantly worldwide
- Secure Bank Alfalah Payment Gateway integration with Visa/Mastercard support
- 52+ live products across 7 game categories
- Affiliate Hub with analytics for reseller partnerships
- 24/7 customer support with worldwide activation support
- Region-unlocked products verified for global access`,
      businessModel: 'Global digital entertainment platform, music distribution service, creative technology company, or multimedia production house',
      targetMarket: 'Global entertainment technology market, music distribution networks, creative agencies, digital media conglomerates, and international investors',
      revenueModel: 'Platform subscriptions, content distribution, licensing, strategic partnerships, advertising, and B2B services',
      growthOpportunity: 'As the flagship domain, playbeatdigital.world can anchor a complete digital entertainment ecosystem. The global entertainment and media market is projected to reach $2.93T by 2026.',
      competitiveAdvantage: 'The most comprehensive and brand-authoritative domain in the PlayBeat portfolio. The .world extension positions the business for global operations from day one.',
      suggestedSellingPrice: 1800000,
      minimumOffer: 1260000,
      buyNowPrice: 1800000,
      aiValuation: 1710000,
      websiteUrl: 'https://playbeatdigital.world',
      technologyStack: 'Next.js, React, Node.js, AWS, PostgreSQL, Redis, CloudFront CDN',
      thumbnail: '/thumbnails/playbeatdigital-world.png',
      tags: 'world, global, music, digital, entertainment, platform, flagship, brand, international, media',
    },
    {
      name: 'blockexchange.buzz',
      category: 'domains',
      industry: 'Blockchain & Cryptocurrency',
      country: 'Pakistan',
      city: 'Lahore',
      businessStage: 'startup',
      featured: true,
      overview: `**blockexchange.buzz** is a fully operational cryptocurrency binary options trading platform with 50,000+ active traders and $2.4B+ trading volume.

**Platform Features:**
- Binary options trading on 8 top cryptocurrencies (BTC, ETH, BNB, SOL, DOGE, XRP, ADA, TRX)
- Real-time price charts with sub-second live data updates
- Up to 50% returns per trade with instant settlements
- Live trading interface with 24h high/low and volume data
- Secure wallet with bank-grade encryption
- 24/7 human support and $2.4B+ cumulative trading volume
- Professional trading toolkit built for speed and security`,
      businessModel: 'Cryptocurrency exchange platform, crypto news & analytics portal, DeFi aggregator, or blockchain education/community platform',
      targetMarket: 'Cryptocurrency traders, blockchain enthusiasts, DeFi investors, and the rapidly growing Pakistani crypto community (25M+ estimated holders)',
      revenueModel: 'Trading commissions, premium subscriptions, advertising, affiliate partnerships, token listing fees',
      growthOpportunity: 'The global cryptocurrency market cap exceeds $2T. Pakistan ranks among the top 15 countries in crypto adoption (Chainalysis 2023).',
      competitiveAdvantage: 'The name "BlockExchange" is immediately understood globally in the crypto space. The .buzz extension adds uniqueness and memorability.',
      suggestedSellingPrice: 1500000,
      minimumOffer: 1050000,
      buyNowPrice: 1500000,
      aiValuation: 1425000,
      websiteUrl: 'https://blockexchange.buzz',
      technologyStack: 'React, Node.js, WebSocket, Redis, PostgreSQL, Kubernetes, Cloudflare',
      thumbnail: '/thumbnails/blockexchange-buzz.png',
      tags: 'blockchain, crypto, exchange, trading, DeFi, bitcoin, cryptocurrency, news, buzz, digital assets',
    },
    {
      name: 'brockexchange.quest',
      category: 'domains',
      industry: 'Trading & Finance',
      country: 'Pakistan',
      city: 'Islamabad',
      businessStage: 'startup',
      featured: false,
      overview: `**brockexchange.quest** is a cryptocurrency trading platform (BlockExchange mirror) offering binary options trading on 8+ cryptocurrencies with real-time market data.

**Platform Features:**
- Binary options trading on BTC, ETH, BNB, SOL, DOGE, XRP, ADA, TRX, BTG
- Real-time price tracking with live 24h high/low and volume indicators
- Up to 50% maximum returns with instant settlement engine
- Secure wallet system with multi-signature protection
- Professional charting tools and market analysis features
- 50,000+ registered traders with $2.4B+ trading volume
- 99.9% uptime with 24/7 customer support`,
      businessModel: 'Trading education platform, gamified investment app, financial mentorship community, or branded trading tools provider',
      targetMarket: 'Aspiring traders, investment learners, financial education seekers, and retail investors in Pakistan and emerging markets',
      revenueModel: 'Course subscriptions, premium trading tools, community memberships, affiliate partnerships, and sponsored content',
      growthOpportunity: 'Financial literacy and trading education is a rapidly growing sector. Pakistan\'s stock market (PSX) has seen record activity.',
      competitiveAdvantage: 'The .quest TLD is unique and memorable in the financial space. The gamification angle differentiates from traditional financial education platforms.',
      suggestedSellingPrice: 1000000,
      minimumOffer: 700000,
      buyNowPrice: 1000000,
      aiValuation: 950000,
      websiteUrl: 'https://brockexchange.quest',
      technologyStack: 'Next.js, React, Python, WebSocket for real-time data, PostgreSQL',
      thumbnail: '/thumbnails/brockexchange-quest.png',
      tags: 'trading, exchange, finance, quest, education, investment, stock, forex, learning, gamification',
    },
    {
      name: 'buzzcryp.buzz',
      category: 'domains',
      industry: 'Cryptocurrency & Blockchain',
      country: 'Pakistan',
      city: 'Karachi',
      businessStage: 'startup',
      featured: false,
      overview: `**buzzcryp.buzz** is a secure, institutional-grade cryptocurrency trading platform with multi-tenant isolation, full audit trails, and bank-grade security.

**Platform Features:**
- Role-based access control (RBAC) with JWT + bcrypt authentication
- Multi-tenant architecture with full audit logging
- 120+ crypto trading pairs including BTC, ETH, SOL, ADA, XRP, DOGE, and more
- 50,000+ active traders with $2.8B+ total cumulative volume
- Real-time market data with live price tracking
- Institutional-grade security with tenant isolation
- 99.9% uptime SLA with dedicated support channels`,
      businessModel: 'Crypto news aggregator, trending token tracker, crypto social media platform, meme coin analysis, or affiliate marketing hub',
      targetMarket: 'Crypto enthusiasts, meme coin traders, social media-savvy investors, and the broader cryptocurrency community',
      revenueModel: 'Advertising, sponsored content, affiliate referrals, premium alerts, and NFT/token partnerships',
      growthOpportunity: 'Crypto social media and "degen" trading culture has exploded globally. BuzzCryp\'s brand identity is perfectly aligned with this trend.',
      competitiveAdvantage: 'The name "BuzzCryp" is inherently viral and shareable. The double-buzz brand identity is unique in the crypto space.',
      suggestedSellingPrice: 1000000,
      minimumOffer: 700000,
      buyNowPrice: 1000000,
      aiValuation: 950000,
      websiteUrl: 'https://buzzcryp.buzz',
      technologyStack: 'React, Node.js, WebSocket, Redis, PostgreSQL, Vercel Edge',
      thumbnail: '/thumbnails/buzzcryp-buzz.png',
      tags: 'crypto, buzz, news, trending, blockchain, meme, tokens, viral, social, community',
    },
    {
      name: 'nextradepro.top',
      category: 'websites',
      industry: 'Trading & Technology',
      country: 'Pakistan',
      city: 'Islamabad',
      businessStage: 'growth',
      featured: true,
      overview: `**nextradepro.top** (NexTradePro) is a professional binary options trading platform for cryptocurrency assets with 50,000+ active traders and $2.4B+ 24h volume.

**Platform Features:**
- Binary options trading on 12+ top crypto assets with up to 50% returns in 120 seconds
- Millisecond-order execution with professional matching engine
- Cold-storage custody wallet with multi-signature protection
- Real-time charting with 99.9% uptime guarantee
- 12 listed coins: BTC, ETH, BNB, SOL, XRP, ADA, DOGE, AVAX, DOT, LINK, LTC, TRX
- 24/7 human broker support (not just bots)
- Live trading interface with instant payouts`,
      businessModel: 'Professional trading platform, FinTech SaaS, algorithmic trading tools, prop trading firm, or financial technology solutions provider',
      targetMarket: 'Professional traders, FinTech companies, prop trading firms, institutional investors, and serious retail traders',
      revenueModel: 'Platform subscriptions, trading commissions, SaaS licensing, API access fees, and premium support tiers',
      growthOpportunity: 'Professional trading tools and FinTech SaaS is a high-growth sector. The professional trading tools market is projected to reach $15B+ by 2027.',
      competitiveAdvantage: 'The three-word brand name conveys professionalism, innovation, and expertise. The .top TLD reinforces premium positioning.',
      suggestedSellingPrice: 1200000,
      minimumOffer: 840000,
      buyNowPrice: 1200000,
      aiValuation: 1140000,
      websiteUrl: 'https://nextradepro.top',
      technologyStack: 'Next.js, TypeScript, Python, WebSocket, Redis, PostgreSQL, Kubernetes, AWS',
      thumbnail: '/thumbnails/nextradepro-top.png',
      tags: 'trading, pro, next, FinTech, SaaS, professional, algorithmic, platform, technology, innovation',
    },
    {
      name: 'playbeattv.buzz',
      category: 'domains',
      industry: 'Entertainment & Media',
      businessStage: 'startup',
      featured: true,
      overview: `**playbeattv.buzz** is a premium entertainment and streaming domain in the PlayBeat ecosystem, extending the brand into TV/OTT broadcasting and video content networks.

**Brand Value:**
- Part of the PlayBeat Digital brand family (playbeat.live, playbeat.digital, playbeatdigital.world)
- .buzz TLD adds viral marketing appeal and social media discoverability
- Perfect for OTT streaming platform, live TV service, or video content network
- Strong brand synergy with the existing PlayBeat digital products ecosystem
- Ideal for media companies, content creators, or entertainment networks`,
      suggestedSellingPrice: 1200000,
      minimumOffer: 900000,
      buyNowPrice: 1200000,
      websiteUrl: 'https://playbeattv.buzz',
      technologyStack: 'Vercel, Next.js',
      thumbnail: '/thumbnails/playbeattv-buzz.png',
      tags: 'streaming, tv, entertainment, ott, video, live',
    },
    {
      name: 'zxc-sigma-ivory.vercel.app',
      category: 'websites',
      industry: 'Technology',
      businessStage: 'growth',
      featured: true,
      overview: `**Drip Again** (zxc-sigma-ivory.vercel.app) is a premium fashion resale marketplace for authenticated pre-owned luxury streetwear and sneakers.

**Platform Features:**
- 50,000+ authenticated items listed with 180,000+ happy members
- Buy/sell premium fashion: sneakers, luxury goods, and streetwear
- Verified seller system with identity and history checks
- Featured curated drops with 2,841+ new weekly additions
- Top brands: Nike Air Jordan, Gucci, Adidas Yeezy, and more
- Buyer protection, carbon-neutral shipping, and 4.9★ average seller rating
- "BUY | SELL | REPEAT" circular fashion model reducing waste`,
      suggestedSellingPrice: 1500000,
      minimumOffer: 1200000,
      buyNowPrice: 1500000,
      websiteUrl: 'https://zxc-sigma-ivory.vercel.app/',
      technologyStack: 'Vercel, Next.js, React, Tailwind CSS',
      thumbnail: '/thumbnails/zxc-sigma-ivory.png',
      tags: 'web-app, vercel, modern, responsive, fullstack',
    },
    {
      name: 'bixx/malik',
      category: 'websites',
      industry: 'Technology',
      businessStage: 'startup',
      featured: false,
      overview: `**bixx/malik** is a professional developer portfolio and web project deployed on Vercel, showcasing modern front-end development with clean architecture and optimized deployment.

**Technical Features:**
- Hosted on Vercel with automatic CI/CD pipeline
- Modern responsive design with professional UI/UX
- Clean codebase following industry best practices
- Optimized performance with edge deployment capabilities
- Ideal as a developer portfolio, agency showcase, or personal brand website
- Scalable infrastructure ready for business deployment`,
      suggestedSellingPrice: 300000,
      minimumOffer: 250000,
      buyNowPrice: 300000,
      websiteUrl: 'https://vercel.com/bixx/malik',
      technologyStack: 'Vercel, Next.js, Tailwind CSS',
      thumbnail: '/thumbnails/bixx-malik.png',
      tags: 'portfolio, developer, vercel, minimal, clean',
    },
    {
      name: 'magxtv.click',
      category: 'websites',
      industry: 'Entertainment & Media',
      businessStage: 'growth',
      featured: true,
      overview: `**MaGx World Super IPTV** (magxtv.click) is an enterprise-grade IPTV reseller panel and streaming management platform with multi-provider authentication.

**Platform Features:**
- Enterprise IPTV Reseller Panel v2.4.1 with full management capabilities
- Multi-provider authentication: Google, Facebook, X (Twitter), TikTok, PayPal
- User management with secure sign-in and account creation
- Reseller hierarchy with subscription management
- Professional admin dashboard for IPTV service operators
- Built for IPTV businesses requiring reseller/distributor infrastructure
- Next.js powered with modern authentication flow`,
      suggestedSellingPrice: 1200000,
      minimumOffer: 900000,
      buyNowPrice: 1200000,
      websiteUrl: 'https://magxtv.click/',
      technologyStack: 'Vercel, Next.js, React',
      thumbnail: '/thumbnails/magxtv-click.png',
      tags: 'streaming, tv, entertainment, video, media, web-app',
    },
    {
      name: 'malik-indol-six.vercel.app',
      category: 'websites',
      industry: 'Technology',
      businessStage: 'growth',
      featured: true,
      overview: `**Esterra** (malik-indol-six.vercel.app) is a comprehensive real estate marketplace and admin console with 2,400+ active listings across 42 cities.

**Platform Features:**
- Full real estate marketplace: Buy, Rent, and Projects sections
- 2,400+ active property listings with 8,900+ closed deals
- Admin console with complete property management
- Verified listings vetted for accuracy and legal clarity
- Expert agents with 10+ years average experience
- Real-time market insights with pricing, trends, and ROI projections
- Trusted by 12,000+ homeowners over 18 years
- Search, filter, and browse with transparent pricing`,
      suggestedSellingPrice: 1800000,
      minimumOffer: 1500000,
      buyNowPrice: 1800000,
      websiteUrl: 'https://malik-indol-six.vercel.app/',
      technologyStack: 'Vercel, Next.js, React, Tailwind CSS',
      thumbnail: '/thumbnails/malik-indol-six.png',
      tags: 'web-app, vercel, modern, responsive, fullstack, professional',
    },
    {
      name: 'enterprose.vercel.app',
      category: 'websites',
      industry: 'Technology',
      businessStage: 'growth',
      featured: true,
      overview: `**enterprose.vercel.app** is an enterprise-grade SaaS web application built with modern technologies, designed for scalable business operations and professional-grade workflows.

**Technical Features:**
- Deployed on Vercel with edge-ready architecture
- Built with Next.js for optimal performance and SEO
- Professional dashboard interfaces and analytics components
- Responsive design with enterprise UI patterns
- Scalable cloud infrastructure with modern tech stack
- Ready for business deployment with production-grade code quality`,
      suggestedSellingPrice: 1600000,
      minimumOffer: 1300000,
      buyNowPrice: 1600000,
      websiteUrl: 'https://enterprose.vercel.app/',
      technologyStack: 'Vercel, Next.js, React, Tailwind CSS',
      thumbnail: '/thumbnails/enterprose.png',
      tags: 'saas, enterprise, dashboard, analytics, vercel, business',
    },
  ];

  // Clear existing data for clean seed
  const deleted = await db.project.deleteMany({ where: { sellerId: SELLER_ID } });
  if (deleted.count > 0) console.log(`  🗑️  Cleared ${deleted.count} existing projects`);

  for (const project of projects) {
    const created = await db.project.create({
      data: {
        name: project.name,
        category: project.category,
        industry: project.industry ?? null,
        country: project.country ?? null,
        city: project.city ?? null,
        businessStage: project.businessStage ?? 'startup',
        status: 'active',
        visibility: 'public',
        featured: project.featured,
        overview: project.overview ?? null,
        businessModel: project.businessModel ?? null,
        targetMarket: project.targetMarket ?? null,
        revenueModel: project.revenueModel ?? null,
        growthOpportunity: project.growthOpportunity ?? null,
        competitiveAdvantage: project.competitiveAdvantage ?? null,
        suggestedSellingPrice: project.suggestedSellingPrice ?? null,
        minimumOffer: project.minimumOffer ?? null,
        buyNowPrice: project.buyNowPrice ?? null,
        aiValuation: project.aiValuation ?? null,
        websiteUrl: project.websiteUrl ?? null,
        technologyStack: project.technologyStack ?? null,
        thumbnail: project.thumbnail ?? null,
        tags: project.tags ?? null,
        sellerId: SELLER_ID,
      },
    });
    console.log(`  ✅ ${created.name} — PKR ${((created.buyNowPrice ?? 0) / 1000000).toFixed(1)}M`);
  }

  const total = projects.reduce((sum, p) => sum + (p.buyNowPrice ?? 0), 0);
  console.log(`\n🎉 Seeded ${projects.length} projects | Total Portfolio: PKR ${(total / 1000000).toFixed(1)}M (US$ ~$${Math.round(total / 278).toLocaleString()})`);
  console.log(`🌐 Brand: www.makethisdeal.biz | "Together We Grow Strong"\n`);

  await db.$disconnect();
}

seed().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});