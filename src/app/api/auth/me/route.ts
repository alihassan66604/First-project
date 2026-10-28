import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';

/** Returns the logged-in user (the session cookie is httpOnly, so the browser can't read it directly). */
export async function GET() {
  try {
    const user = await verifySessionToken(cookies().get(SESSION_COOKIE)?.value, process.env.SESSION_SECRET ?? '');
    if (!user) return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
    return NextResponse.json({ user });
  } catch (error) {
    console.error('[auth/me]', error);
    return NextResponse.json({ error: 'Session check failed.' }, { status: 500 });
  }
}
