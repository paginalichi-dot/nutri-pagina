import { db } from '@/lib/db';
import { isSerializationFailure } from '@/lib/db-errors';
import { type DbTransaction, withSerializableTransaction } from '@/lib/db/transaction';
import type { RecordRef } from '@/lib/record-ref';
import type { AppointmentDetail, AppointmentRow, AppointmentStatus, PatientContact, TimeRange } from '../domain/appointment.schema';
import type { BlockInput, BlockRow } from '../domain/block.schema';
import { agendaReads } from './agenda-reads';
import { agendaWrites } from './agenda-writes';

export type WeeklySlot = { weekday: number; startMinute: number; endMinute: number };
export type LocationSchedule = { active: boolean; hours: WeeklySlot[] };

export type NewAppointment = {
  locationId: string;
  startsAt: Date;
  endsAt: Date;
  status: AppointmentStatus;
  source: 'ONLINE' | 'PANEL';
  patientName: string;
  patientPhone: string;
  patientEmail: string | null;
  healthInsuranceId: string | null;
};

export type AppointmentMove = { locationId: string; startsAt: Date; endsAt: Date };

export type AgendaRepository = {
  listAppointments(range: TimeRange): Promise<AppointmentRow[]>;
  findAppointment(id: string): Promise<AppointmentDetail | null>;
  listBusy(range: TimeRange, ignoreId: string | null): Promise<TimeRange[]>;
  findSchedule(locationId: string): Promise<LocationSchedule | null>;
  listActiveHours(): Promise<WeeklySlot[]>;
  findNextActive(now: Date): Promise<AppointmentDetail | null>;
  listContactsBefore(before: Date): Promise<PatientContact[]>;
  getSlotMinutes(): Promise<number | null>;
  findActiveByEmail(email: string, now: Date): Promise<TimeRange | null>;
  countActiveAppointments(range: TimeRange): Promise<number>;
  listBlocks(range: TimeRange): Promise<BlockRow[]>;
  createAppointment(data: NewAppointment): Promise<string>;
  updateStatus(ref: RecordRef, status: AppointmentStatus): Promise<void>;
  moveAppointment(ref: RecordRef, move: AppointmentMove): Promise<void>;
  createBlock(data: BlockInput): Promise<void>;
  deleteBlock(ref: RecordRef): Promise<void>;
  inTransaction<T>(work: (repository: AgendaRepository) => Promise<T>): Promise<T>;
};

const MAX_ATTEMPTS = 5;

const pause = (attempt: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, attempt * (10 + Math.random() * 40)));

async function serializable<T>(work: (repository: AgendaRepository) => Promise<T>, attempt = 1): Promise<T> {
  try {
    return await withSerializableTransaction((tx) => work(createAgendaRepository(tx, true)));
  } catch (error) {
    if (attempt >= MAX_ATTEMPTS || !isSerializationFailure(error)) throw error;
    await pause(attempt);
    return serializable(work, attempt + 1);
  }
}

function createAgendaRepository(client: DbTransaction, transactional: boolean): AgendaRepository {
  const repository: AgendaRepository = {
    ...agendaReads(client),
    ...agendaWrites(client),
    inTransaction: (work) => (transactional ? work(repository) : serializable(work)),
  };
  return repository;
}

export const agendaRepository = createAgendaRepository(db, false);
