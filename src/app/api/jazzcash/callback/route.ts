import { NextRequest, NextResponse } from 'next/server';

/**
 * JazzCash Callback API — Database not available on Vercel.
 */
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/?payment=failed', request.url));
}
