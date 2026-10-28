import { NextResponse, type NextRequest } from 'next/server';
import { decideAccess } from '@/lib/auth/access';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  let role = null;
  try {
    role = (await verifySessionToken(token, process.env.SESSION_SECRET ?? ''))?.role ?? null;
  } catch (error) {
    // Missing SESSION_SECRET: fail closed (treat everyone as logged out) and tell the developer.
    console.error('[middleware]', error instanceof Error ? error.message : error);
  }

  const decision = decideAccess(pathname, role);

  if (decision.action === 'unauthorized') {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }
  if (decision.action === 'redirect') {
    const url = request.nextUrl.clone();
    url.pathname = decision.location;
    url.search = '';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Run on everything except Next.js internals and static files.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
