import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { loginPathFor } from '@/lib/auth/return-path';
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS, type SessionRole, verifySession } from '@/lib/auth/session-token';

const ZONES: ReadonlyArray<{ prefix: string; role: SessionRole }> = [
  { prefix: '/admin', role: 'admin' },
  { prefix: '/mi-espacio', role: 'patient' },
  { prefix: '/reservar', role: 'patient' },
];

const zoneOf = (pathname: string): SessionRole | null =>
  ZONES.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`))?.role ?? null;

// Por qué: con Cache Components la página empieza a enviarse antes que el layout del panel; el proxy decide primero.
function deniedResponse(request: NextRequest, role: SessionRole): NextResponse {
  if (role === 'admin') return NextResponse.rewrite(new URL('/acceso-denegado', request.url));
  return NextResponse.redirect(new URL(loginPathFor(request.nextUrl.pathname, request.nextUrl.search), request.url));
}

// Por qué: renovar en una action o en una precarga puede revivir la cookie que "Cerrar sesión" acaba de borrar.
const isPageLoad = (request: NextRequest): boolean => request.method === 'GET' && request.headers.get('sec-fetch-dest') === 'document';

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const role = zoneOf(request.nextUrl.pathname);
  if (role === null) return NextResponse.next();
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token === undefined ? null : await verifySession(token);
  const allowed = session?.role === role;
  const response = allowed ? NextResponse.next() : deniedResponse(request, role);
  if (allowed && token && isPageLoad(request)) response.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  else if (token !== undefined && !session) response.cookies.delete(SESSION_COOKIE);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
