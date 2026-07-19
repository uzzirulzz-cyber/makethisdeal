import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function POST() {
  try {
    const result = await seedDatabase();
    return NextResponse.json({ success: true, message: 'Database seeded successfully', ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}