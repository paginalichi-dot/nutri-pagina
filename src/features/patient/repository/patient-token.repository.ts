import { db } from '@/lib/db';
import { databaseErrorCode } from '@/lib/db-errors';
import { AppError } from '@/lib/errors';
import type { TokenPurpose } from '../domain/patient.schema';

export type IssuedToken = { patientId: string; purpose: TokenPurpose; tokenHash: string; newEmail: string | null; createdAt: Date; expiresAt: Date };

export type TokenEffect = { verifyEmail?: boolean; passwordHash?: string; useNewEmail?: boolean };

export type Redemption = { tokenHash: string; purpose: TokenPurpose; now: Date; effect: TokenEffect };

export type PatientTokenRepository = {
  issue(token: IssuedToken): Promise<void>;
  redeem(redemption: Redemption): Promise<boolean>;
};

function effectData({ verifyEmail, passwordHash, useNewEmail }: TokenEffect, newEmail: string | null, now: Date): object {
  const ends = passwordHash !== undefined || useNewEmail === true;
  return {
    ...(verifyEmail ? { emailVerifiedAt: now } : {}),
    ...(passwordHash === undefined ? {} : { passwordHash, failedAttempts: 0, lockedUntil: null }),
    ...(useNewEmail && newEmail ? { email: newEmail } : {}),
    ...(ends ? { sessionVersion: { increment: 1 } } : {}),
    version: { increment: 1 },
  };
}

async function redeemInTransaction({ tokenHash, purpose, now, effect }: Redemption): Promise<boolean> {
  return db.$transaction(async (tx) => {
    const token = await tx.patientToken.findFirst({ where: { tokenHash, purpose, usedAt: null, expiresAt: { gt: now } }, select: { id: true, patientId: true, newEmail: true } });
    if (!token) return false;
    const { count } = await tx.patientToken.updateMany({ where: { id: token.id, usedAt: null }, data: { usedAt: now, version: { increment: 1 } } });
    if (count === 0) return false;
    await tx.patient.update({ where: { id: token.patientId }, data: effectData(effect, token.newEmail, now) });
    return true;
  });
}

export const patientTokenRepository: PatientTokenRepository = {
  async issue({ patientId, purpose, createdAt, ...token }) {
    await db.$transaction([
      db.patientToken.updateMany({ where: { patientId, purpose, usedAt: null }, data: { usedAt: createdAt, version: { increment: 1 } } }),
      db.patientToken.create({ data: { patientId, purpose, createdAt, ...token } }),
    ]);
  },

  async redeem(redemption) {
    try {
      return await redeemInTransaction(redemption);
    } catch (error) {
      if (redemption.effect.useNewEmail && databaseErrorCode(error) === 'DUPLICATE') throw new AppError('EMAIL_IN_USE');
      throw error;
    }
  },
};
