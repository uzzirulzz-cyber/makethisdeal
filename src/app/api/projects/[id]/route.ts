import { NextRequest, NextResponse } from 'next/server';
import { findStaticProject } from '@/lib/static-products';

/**
 * GET /api/projects/[id] — serves from static in-memory data.
 * No database dependency — works on Vercel serverless.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = findStaticProject(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/projects/[id] — disabled on Vercel (no DB).
 */
export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = findStaticProject(id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  return NextResponse.json({
    message: 'Product updates via API are disabled. Edit src/lib/static-products.ts to update products.',
    status: 'info',
    project,
  });
}

/**
 * DELETE /api/projects/[id] — disabled on Vercel (no DB).
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = findStaticProject(id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  return NextResponse.json({
    message: 'Product deletion via API is disabled. Edit src/lib/static-products.ts to remove products.',
    status: 'info',
  });
}
