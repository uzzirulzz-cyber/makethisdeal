import { NextRequest, NextResponse } from 'next/server';
import { STATIC_PRODUCTS } from '@/lib/static-products';

/**
 * GET /api/projects — serves from static in-memory data.
 * No database dependency — works on Vercel serverless.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category') || '';
    const country = searchParams.get('country') || '';
    const query = searchParams.get('query') || '';
    const priceMin = searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined;
    const priceMax = searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined;
    const revenueMin = searchParams.get('revenueMin') ? parseFloat(searchParams.get('revenueMin')!) : undefined;
    const revenueMax = searchParams.get('revenueMax') ? parseFloat(searchParams.get('revenueMax')!) : undefined;
    const roiMin = searchParams.get('roiMin') ? parseFloat(searchParams.get('roiMin')!) : undefined;
    const sortBy = searchParams.get('sortBy') || 'newest';

    // Filter
    let filtered = STATIC_PRODUCTS.filter((p) => p.status === 'active' && p.visibility === 'public');

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (country) {
      filtered = filtered.filter((p) => p.country === country);
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.overview && p.overview.toLowerCase().includes(q)) ||
          (p.tags && p.tags.toLowerCase().includes(q)) ||
          (p.industry && p.industry.toLowerCase().includes(q)) ||
          (p.country && p.country.toLowerCase().includes(q))
      );
    }
    if (priceMin !== undefined) {
      filtered = filtered.filter((p) => (p.suggestedSellingPrice ?? 0) >= priceMin);
    }
    if (priceMax !== undefined) {
      filtered = filtered.filter((p) => (p.suggestedSellingPrice ?? 0) <= priceMax);
    }
    if (revenueMin !== undefined) {
      filtered = filtered.filter((p) => (p.annualRevenue ?? 0) >= revenueMin);
    }
    if (revenueMax !== undefined) {
      filtered = filtered.filter((p) => (p.annualRevenue ?? 0) <= revenueMax);
    }
    if (roiMin !== undefined) {
      filtered = filtered.filter((p) => (p.expectedROI ?? 0) >= roiMin);
    }

    // Sort
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => (a.suggestedSellingPrice ?? 0) - (b.suggestedSellingPrice ?? 0));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.suggestedSellingPrice ?? 0) - (a.suggestedSellingPrice ?? 0));
        break;
      case 'roi_high':
        filtered.sort((a, b) => (b.expectedROI ?? 0) - (a.expectedROI ?? 0));
        break;
      case 'revenue_high':
        filtered.sort((a, b) => (b.annualRevenue ?? 0) - (a.annualRevenue ?? 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.monthlyVisitors ?? 0) - (a.monthlyVisitors ?? 0));
        break;
      default:
        // newest — keep original order (featured first, then by creation date)
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        break;
    }

    // Paginate
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const projects = filtered.slice(start, start + limit);

    return NextResponse.json({
      projects,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/projects — still uses DB for admin-created products.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Return a static mock response — DB operations are unsupported on Vercel
    // Admin can manage products by editing static-products.ts
    return NextResponse.json(
      { message: 'Product creation via API is disabled. Edit src/lib/static-products.ts to add products.', status: 'info' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
