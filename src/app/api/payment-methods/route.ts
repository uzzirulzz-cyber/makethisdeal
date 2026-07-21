import { NextResponse } from 'next/server';
import { getEnabledMethods } from '@/lib/payment-methods';

export async function GET() {
  return NextResponse.json({ methods: getEnabledMethods() });
}