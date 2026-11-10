import type { DbTransaction } from '@/lib/db/transaction';
import { type AppointmentDetail, AppointmentDetailSchema, type AppointmentRow, AppointmentRowSchema, type PatientContact, type TimeRange } from '../domain/appointment.schema';
import { type BlockRow, BlockRowSchema } from '../domain/block.schema';
import type { AgendaRepository, LocationSchedule, WeeklySlot } from './agenda.repository';
import type { PendingReads } from './agenda-pending-reads';

type AgendaReads = Omit<AgendaRepository, keyof PendingReads | 'createAppointment' | 'updateStatus' | 'moveAppointment' | 'createBlock' | 'deleteBlock' | 'inTransaction'>;

export const ACTIVE = { in: ['PENDING' as const, 'CONFIRMED' as const] };
const RANGE = { startsAt: true, endsAt: true } as const;
export const ROW = {
  id: true,
  locationId: true,
  startsAt: true,
  endsAt: true,
  status: true,
  source: true,
  patientName: true,
  patientPhone: true,
  patientEmail: true,
  version: true,
  location: { select: { name: true, kind: true, address: true, directions: true, videoUrl: true } },
  healthInsurance: { select: { name: true } },
} as const;

type Row = { location: { name: string; kind: string; address: string | null; directions: string | null; videoUrl: string | null }; healthInsurance: { name: string } | null };

const overlapping = ({ startsAt, endsAt }: TimeRange): { startsAt: { lt: Date }; endsAt: { gt: Date } } => ({ startsAt: { lt: endsAt }, endsAt: { gt: startsAt } });

export function toRow<T extends Row>({ location, healthInsurance, ...row }: T): AppointmentRow {
  return AppointmentRowSchema.parse({ ...row, locationName: location.name, healthInsuranceName: healthInsurance?.name ?? null });
}

export function toDetail<T extends Row>(row: T): AppointmentDetail {
  const { kind, address, directions, videoUrl } = row.location;
  return AppointmentDetailSchema.parse({ ...toRow(row), place: { kind, address, directions, videoUrl } });
}

async function contactsBefore(client: DbTransaction, before: Date): Promise<PatientContact[]> {
  const where = { startsAt: { lt: before }, status: { not: 'CANCELLED' as const } };
  const rows = await client.appointment.findMany({ where, select: { patientPhone: true, patientEmail: true }, distinct: ['patientPhone', 'patientEmail'] });
  return rows.map(({ patientPhone, patientEmail }) => ({ phone: patientPhone, email: patientEmail }));
}

async function byPatientEmail(client: DbTransaction, email: string): Promise<AppointmentDetail[]> {
  const rows = await client.appointment.findMany({ where: { patientEmail: email }, select: ROW, orderBy: { startsAt: 'asc' } });
  return rows.map(toDetail);
}

export function agendaReads(client: DbTransaction): AgendaReads {
  return {
    async listAppointments(range: TimeRange): Promise<AppointmentRow[]> {
      const rows = await client.appointment.findMany({ where: overlapping(range), select: ROW, orderBy: { startsAt: 'asc' } });
      return rows.map(toRow);
    },
    async findAppointment(id: string): Promise<AppointmentDetail | null> {
      const row = await client.appointment.findUnique({ where: { id }, select: ROW });
      return row ? toDetail(row) : null;
    },
    async listBusy(range: TimeRange, ignoreId: string | null): Promise<TimeRange[]> {
      const where = { ...overlapping(range), status: ACTIVE, ...(ignoreId ? { id: { not: ignoreId } } : {}) };
      const [appointments, blocks] = await Promise.all([client.appointment.findMany({ where, select: RANGE }), client.timeBlock.findMany({ where: overlapping(range), select: RANGE })]);
      return [...appointments, ...blocks];
    },
    async findSchedule(locationId: string): Promise<LocationSchedule | null> {
      const hours = { select: { weekday: true, startMinute: true, endMinute: true } };
      return client.location.findUnique({ where: { id: locationId }, select: { active: true, hours } });
    },
    listActiveHours: (): Promise<WeeklySlot[]> => client.weeklyHours.findMany({ where: { location: { active: true } }, select: { weekday: true, startMinute: true, endMinute: true } }),
    async findNextActive(now: Date): Promise<AppointmentDetail | null> {
      const row = await client.appointment.findFirst({ where: { status: ACTIVE, startsAt: { gte: now } }, select: ROW, orderBy: { startsAt: 'asc' } });
      return row ? toDetail(row) : null;
    },
    listContactsBefore: (before: Date): Promise<PatientContact[]> => contactsBefore(client, before),
    async getSlotMinutes(): Promise<number | null> {
      return (await client.agendaSettings.findUnique({ where: { id: 1 }, select: { slotMinutes: true } }))?.slotMinutes ?? null;
    },
    async findActiveByEmail(email: string, now: Date): Promise<TimeRange | null> {
      return client.appointment.findFirst({ where: { patientEmail: email, status: ACTIVE, startsAt: { gt: now } }, select: RANGE, orderBy: { startsAt: 'asc' } });
    },
    listByPatientEmail: (email: string): Promise<AppointmentDetail[]> => byPatientEmail(client, email),
    countActiveAppointments: (range: TimeRange): Promise<number> => client.appointment.count({ where: { ...overlapping(range), status: ACTIVE } }),
    async listBlocks(range: TimeRange): Promise<BlockRow[]> {
      const rows = await client.timeBlock.findMany({ where: overlapping(range), select: { id: true, startsAt: true, endsAt: true, reason: true, version: true }, orderBy: { startsAt: 'asc' } });
      return rows.map((row) => BlockRowSchema.parse(row));
    },
  };
}
