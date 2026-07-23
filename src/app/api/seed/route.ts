import { NextResponse } from 'next/server';

/**
 * Seed API — Database not available on Vercel serverless.
 * Products are now served from static JSON (src/lib/static-products.ts).
 * This endpoint is no longer needed.
 */
export async function POST() {
  return NextResponse.json({
    message: 'Seeding is not needed. Products are loaded from src/lib/static-products.ts',
    status: 'info',
  });
}

export async function GET() {
  return NextResponse.json({
    projects: 11,
    source: 'static',
    message: 'Products served from static JSON, not database',
  });
}
