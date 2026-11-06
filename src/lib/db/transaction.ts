import type { Prisma } from '@/generated/prisma/client';
import { db } from './index';

export type DbTransaction = Prisma.TransactionClient;

export async function withTransaction<T>(work: (tx: DbTransaction) => Promise<T>): Promise<T> {
  return db.$transaction(work);
}
