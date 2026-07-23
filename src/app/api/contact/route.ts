import { NextRequest, NextResponse } from 'next/server';

/**
 * Contact API — Database operations not available on Vercel serverless.
 * Validates input and returns a friendly message (no persistence).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // On Vercel, we accept the message but don't persist it.
    // In production, integrate with an email service (SendGrid, Resend, etc.)
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ messages: [] });
}
