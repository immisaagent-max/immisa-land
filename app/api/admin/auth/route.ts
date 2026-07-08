import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, createSession, clearSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (body?.action === 'logout') {
    await clearSession();
    return NextResponse.json({ ok: true });
  }

  if (!body?.password || !checkPassword(body.password)) {
    return NextResponse.json({ error: 'invalid password' }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
