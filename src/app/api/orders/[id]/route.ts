import { NextRequest, NextResponse } from 'next/server';

/**
 * Order Detail API — Database not available on Vercel serverless.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  return NextResponse.json({ error: 'Order details not available on this deployment' }, { status: 503 });
}
