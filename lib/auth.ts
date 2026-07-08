import { cookies } from 'next/headers';
import { createHmac } from 'crypto';

const SECRET = process.env.ADMIN_SECRET ?? 'immisa-admin-secret-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123';
const SESSION_COOKIE = 'immisa_admin_session';

function sign(value: string) {
  return createHmac('sha256', SECRET).update(value).digest('hex');
}

export function checkPassword(input: string) {
  return input === ADMIN_PASSWORD;
}

export async function createSession() {
  const payload = `admin:${Date.now()}`;
  const token = `${payload}:${sign(payload)}`;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return false;
    const lastColon = token.lastIndexOf(':');
    const payload = token.slice(0, lastColon);
    const sig = token.slice(lastColon + 1);
    return sig === sign(payload) && payload.startsWith('admin:');
  } catch {
    return false;
  }
}
