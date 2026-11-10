import { afterEach, vi } from 'vitest';

vi.mock('next/headers', async () => {
  const { cookieJar } = await import('../cookie-jar');
  const { requestHeaders } = await import('../request-headers');
  return { cookies: async () => cookieJar, headers: async () => requestHeaders };
});

afterEach(async () => {
  const { cookieJar } = await import('../cookie-jar');
  cookieJar.clear();
  const { clearRequestHeaders } = await import('../request-headers');
  clearRequestHeaders();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});
