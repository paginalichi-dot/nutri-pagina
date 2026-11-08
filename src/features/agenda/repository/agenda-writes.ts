import { isExclusionViolation } from '@/lib/db-errors';
import type { DbTransaction } from '@/lib/db/transaction';
import { AppError } from '@/lib/errors';
import type { RecordRef } from '@/lib/record-ref';
import type { AppointmentStatus } from '../domain/appointment.schema';
import type { BlockInput } from '../domain/block.schema';
import type { AgendaRepository, AppointmentMove, NewAppointment } from './agenda.repository';

type AgendaWrites = Pick<AgendaRepository, 'createAppointment' | 'updateStatus' | 'moveAppointment' | 'createBlock' | 'deleteBlock'>;

function stale(count: number): void {
  if (count === 0) throw new AppError('STALE_VERSION');
}

async function slotGuard<T>(work: () => Promise<T>): Promise<T> {
  try {
    return await work();
  } catch (error) {
    if (isExclusionViolation(error)) throw new AppError('SLOT_TAKEN', { cause: error });
    throw error;
  }
}

export function agendaWrites(client: DbTransaction): AgendaWrites {
  return {
    createAppointment: (data: NewAppointment): Promise<string> => slotGuard(async () => (await client.appointment.create({ data, select: { id: true } })).id),
    async updateStatus({ id, version }: RecordRef, status: AppointmentStatus): Promise<void> {
      stale((await client.appointment.updateMany({ where: { id, version }, data: { status, version: { increment: 1 } } })).count);
    },
    moveAppointment: ({ id, version }: RecordRef, move: AppointmentMove): Promise<void> =>
      slotGuard(async () => stale((await client.appointment.updateMany({ where: { id, version }, data: { ...move, version: { increment: 1 } } })).count)),
    async createBlock(data: BlockInput): Promise<void> {
      await client.timeBlock.create({ data });
    },
    async deleteBlock({ id, version }: RecordRef): Promise<void> {
      stale((await client.timeBlock.deleteMany({ where: { id, version } })).count);
    },
  };
}
