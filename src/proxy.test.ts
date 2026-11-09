import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signSession } from '@/lib/auth/session-token';
import { proxy } from './proxy';

const ADMIN_ID = '7d3f8a3e-2f4b-4c1d-9a7e-1b2c3d4e5f60';

type Init = { method?: string; headers?: Record<string, string> };

function request(path: string, token?: string, init: Init = {}): NextRequest {
  const cookie: Record<string, string> = token ? { cookie: `session=${token}` } : {};
  return new NextRequest(`http://localhost${path}`, { method: init.method ?? 'GET', headers: { ...cookie, ...init.headers } });
}

const passes = (response: Response): boolean => response.headers.get('x-middleware-next') === '1';
const rewrittenTo = (response: Response): string | null => response.headers.get('x-middleware-rewrite');

describe('proxy', () => {
  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
  });

  it('al cargar una página del panel con un token válido deja pasar y renueva la cookie por 400 días', async () => {
    const token = await signSession({ subjectId: ADMIN_ID, sessionVersion: 1, role: 'admin' });
    const response = await proxy(request('/admin/cuenta', token, { headers: { 'sec-fetch-dest': 'document' } }));
    expect(passes(response)).toBe(true);
    expect(response.cookies.get('session')).toMatchObject({ value: token, maxAge: 34_560_000, httpOnly: true, secure: true });
  });

  it.each<[string, Init]>([
    ['un POST (una action)', { method: 'POST', headers: { 'sec-fetch-dest': 'document' } }],
    ['una precarga o navegación interna', { headers: { 'sec-fetch-dest': 'empty', rsc: '1' } }],
    ['un pedido sin sec-fetch-dest', {}],
  ])('en %s con token válido no renueva la cookie, para no revivir una sesión cerrada', async (_caso, init) => {
    const token = await signSession({ subjectId: ADMIN_ID, sessionVersion: 1, role: 'admin' });
    const response = await proxy(request('/admin', token, init));
    expect(passes(response)).toBe(true);
    expect(response.cookies.get('session')).toBeUndefined();
  });

  it.each(['/admin', '/admin/cuenta', '/admin/login'])('sin sesión, %s muestra "Acceso denegado"', async (path) => {
    const response = await proxy(request(path));
    expect(rewrittenTo(response)).toBe('http://localhost/acceso-denegado');
  });

  it('T-8 CA-3: una sesión de paciente en el panel ve "Acceso denegado" y conserva su cookie', async () => {
    const token = await signSession({ subjectId: ADMIN_ID, sessionVersion: 1, role: 'patient' });
    const response = await proxy(request('/admin', token, { headers: { 'sec-fetch-dest': 'document' } }));
    expect(rewrittenTo(response)).toBe('http://localhost/acceso-denegado');
    expect(response.cookies.get('session')).toBeUndefined();
  });

  it('US-31: Mi espacio con sesión de paciente pasa y renueva la cookie; sin ella o con la del admin lleva a /login', async () => {
    const patient = await signSession({ subjectId: ADMIN_ID, sessionVersion: 1, role: 'patient' });
    const admin = await signSession({ subjectId: ADMIN_ID, sessionVersion: 1, role: 'admin' });
    const page = { headers: { 'sec-fetch-dest': 'document' } };
    const allowed = await proxy(request('/mi-espacio', patient, page));
    expect(passes(allowed)).toBe(true);
    expect(allowed.cookies.get('session')).toMatchObject({ value: patient });
    for (const token of [undefined, admin]) expect((await proxy(request('/mi-espacio/datos', token))).headers.get('location')).toBe('http://localhost/login');
  });

  it('con un token adulterado borra la cookie y lo trata como sin sesión', async () => {
    const token = await signSession({ subjectId: ADMIN_ID, sessionVersion: 1, role: 'admin' });
    const response = await proxy(request('/admin/agenda', `${token}x`));
    expect(rewrittenTo(response)).toBe('http://localhost/acceso-denegado');
    expect(response.cookies.get('session')?.value).toBe('');
  });

  it.each([
    ['el sitio público, aunque haya token', request('/', 'cualquiera')],
    ['una ruta que sólo empieza parecido', request('/administracion', 'cualquiera')],
    ['/reservar, que es pública', request('/reservar', 'cualquiera')],
    ['/login, el login de todos', request('/login', 'cualquiera')],
  ])('no toca %s', async (_caso, incoming) => {
    const response = await proxy(incoming);
    expect(passes(response)).toBe(true);
    expect(response.cookies.get('session')).toBeUndefined();
  });
});
