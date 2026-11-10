const INTERNAL_PATH = /^\/(?![/\\])[\w\-./?=&%~]*$/;

export function safeReturnPath(value: unknown): string | null {
  return typeof value === 'string' && INTERNAL_PATH.test(value) ? value : null;
}

export function loginPathFor(pathname: string, search = ''): string {
  return `/login?volver=${encodeURIComponent(`${pathname}${search}`)}`;
}
