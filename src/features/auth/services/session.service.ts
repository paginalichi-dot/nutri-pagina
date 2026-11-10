import { verifySession } from '@/lib/auth/session-token';
import { AppError } from '@/lib/errors';
import type { SessionClaims } from '../domain/admin.schema';
import { type AdminRepository, adminRepository } from '../repository/admin.repository';

export type SessionService = { authenticate(token: string | undefined): Promise<SessionClaims> };

export function createSessionService(repository: Pick<AdminRepository, 'findSessionVersion'>): SessionService {
  return {
    async authenticate(token) {
      const claims = token ? await verifySession(token) : null;
      if (claims?.role !== 'admin') throw new AppError('UNAUTHENTICATED');
      const current = await repository.findSessionVersion(claims.subjectId);
      if (current === null) throw new AppError('UNAUTHENTICATED');
      if (current !== claims.sessionVersion) throw new AppError('SESSION_EXPIRED');
      return { adminId: claims.subjectId, sessionVersion: claims.sessionVersion };
    },
  };
}

export const sessionService = createSessionService(adminRepository);
