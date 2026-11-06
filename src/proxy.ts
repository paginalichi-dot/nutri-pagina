import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PATHS = ['/admin'];

const matches = (paths: string[], pathname: string): boolean => paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export function proxy(request: NextRequest): NextResponse {
  if (matches(ADMIN_PATHS, request.nextUrl.pathname)) return NextResponse.redirect(new URL('/', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
