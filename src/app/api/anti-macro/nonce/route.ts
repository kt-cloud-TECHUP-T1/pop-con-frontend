import { NextResponse } from 'next/server';

export async function GET() {
  const nonce = crypto.randomUUID();
  const challenge = crypto.randomUUID();

  return NextResponse.json({
    nonce,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5분
    challenge,
  });
}
