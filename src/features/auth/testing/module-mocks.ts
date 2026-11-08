import { vi } from 'vitest';

export const navigationMock = {
  redirect: vi.fn((url: string): never => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
  forbidden: vi.fn((): never => {
    throw new Error('NEXT_FORBIDDEN');
  }),
};

export async function fakeRepositoryModule(): Promise<Record<string, unknown>> {
  const { createFakeAdminRepository } = await import('./admin-repository.fake');
  return { adminRepository: createFakeAdminRepository() };
}
