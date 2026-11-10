import type { DbTransaction } from '@/lib/db/transaction';
import type { AppointmentDetail, AppointmentRow, TimeRange } from '../domain/appointment.schema';
import type { AgendaRepository } from './agenda.repository';
import { ACTIVE, ROW, toDetail, toRow } from './agenda-reads';

export type PendingReads = Pick<AgendaRepository, 'countUpcomingByEmail' | 'countPending' | 'listPending' | 'listExpiringPending'>;

const pendingAfter = (now: Date): { status: 'PENDING'; startsAt: { gt: Date } } => ({ status: 'PENDING', startsAt: { gt: now } });

export function agendaPendingReads(client: DbTransaction): PendingReads {
  return {
    countUpcomingByEmail: (email: string, now: Date): Promise<number> => client.appointment.count({ where: { patientEmail: email, status: ACTIVE, startsAt: { gt: now } } }),
    countPending: (now: Date): Promise<number> => client.appointment.count({ where: pendingAfter(now) }),
    async listPending(now: Date): Promise<AppointmentRow[]> {
      const rows = await client.appointment.findMany({ where: pendingAfter(now), select: ROW, orderBy: { startsAt: 'asc' } });
      return rows.map(toRow);
    },
    async listExpiringPending({ startsAt, endsAt }: TimeRange): Promise<AppointmentDetail[]> {
      const where = { status: 'PENDING' as const, startsAt: { gt: startsAt, lte: endsAt } };
      const rows = await client.appointment.findMany({ where, select: ROW, orderBy: { startsAt: 'asc' } });
      return rows.map(toDetail);
    },
  };
}
