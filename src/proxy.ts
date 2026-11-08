import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS, verifySession } from '@/lib/auth/session-token';

const ADMIN = '/admin';
const ACCESS_DENIED = '/acceso-denegado';

const isAdminPath = (pathname: string): boolean => pathname === ADMIN || pathname.startsWith(`${ADMIN}/`);

// Por qué: con Cache Components la página empieza a enviarse antes que el layout del panel; el proxy decide primero.
function adminResponse(request: NextRequest, signedIn: boolean): NextResponse {
  if (signedIn) return NextResponse.next();
  return NextResponse.rewrite(new URL(ACCESS_DENIED, request.url));
}

// Por qué: renovar en una action o en una precarga puede revivir la cookie que "Cerrar sesión" acaba de borrar.
const isPageLoad = (request: NextRequest): boolean => request.method === 'GET' && request.headers.get('sec-fetch-dest') === 'document';

export async function proxy(request: NextRequest): Promise<NextResponse> {
  if (!isAdminPath(request.nextUrl.pathname)) return NextResponse.next();
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const signedIn = token !== undefined && (await verifySession(token)) !== null;
  const response = adminResponse(request, signedIn);
  if (signedIn && token && isPageLoad(request)) response.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  else if (token !== undefined && !signedIn) response.cookies.delete(SESSION_COOKIE);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
