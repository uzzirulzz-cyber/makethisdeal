import { NextResponse } from 'next/server';
import { STATIC_CATEGORIES } from '@/lib/static-products';

/**
 * GET /api/categories — serves from static data.
 * No database dependency — works on Vercel serverless.
 */
export async function GET() {
  return NextResponse.json(STATIC_CATEGORIES);
}
