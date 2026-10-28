import { NextResponse } from 'next/server';
import { authenticate, ROLE_HOME } from '@/lib/auth/accounts';
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_SECONDS } from '@/lib/auth/session';
import { createRateLimiter } from '@/lib/auth/rate-limit';

// 20 attempts per IP per 15 minutes.
const checkRateLimit = createRateLimiter(20, 15 * 60 * 1000);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: `Too many login attempts. Try again in ${Math.ceil(limit.retryAfterSec / 60)} minute(s).` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as { email?: unknown; password?: unknown };
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }
  if (email.length > 254 || password.length > 200 || !EMAIL_PATTERN.test(email.trim())) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  try {
    const user = await authenticate(email, password);
    if (!user) {
      console.warn(`[auth] Login failed for email: "${email}"`);
      return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
    }

    const token = await createSessionToken(user, process.env.SESSION_SECRET ?? 'default_session_secret_32_characters_minimum!');
    const response = NextResponse.json({ user, redirectUrl: ROLE_HOME[user.role] });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: false, // allow http://localhost:3000 in dev
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
    });
    return response;
  } catch (error) {
    console.error('[auth/login error]', error);
    return NextResponse.json({ error: 'Login is temporarily unavailable. Please try again.' }, { status: 500 });
  }
}
