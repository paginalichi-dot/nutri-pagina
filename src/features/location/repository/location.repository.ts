import { db } from '@/lib/db';
import { isExclusionViolation } from '@/lib/db-errors';
import { AppError } from '@/lib/errors';
import { type WeeklyHoursInput, type WeeklyHoursRow, WeeklyHoursRowSchema } from '../domain/hours.schema';
import { type LocationData, type LocationRow, LocationRowSchema, type RecordRef } from '../domain/location.schema';

export type LocationRepository = {
  list(): Promise<LocationRow[]>;
  findById(id: string): Promise<LocationRow | null>;
  create(data: LocationData): Promise<LocationRow>;
  update(ref: RecordRef, data: LocationData): Promise<void>;
  setActive(ref: RecordRef, active: boolean): Promise<void>;
  countUpcomingAppointments(locationId: string, now: Date): Promise<number>;
  listHours(): Promise<WeeklyHoursRow[]>;
  addHours(input: WeeklyHoursInput): Promise<WeeklyHoursRow>;
  deleteHours(ref: RecordRef): Promise<void>;
};

const LOCATION = { id: true, name: true, kind: true, address: true, directions: true, mapUrl: true, videoUrl: true, active: true, version: true } as const;
const HOURS = { id: true, locationId: true, weekday: true, startMinute: true, endMinute: true, version: true } as const;

function stale(count: number): void {
  if (count === 0) throw new AppError('STALE_VERSION');
}

async function insertHours(input: WeeklyHoursInput): Promise<WeeklyHoursRow> {
  try {
    return WeeklyHoursRowSchema.parse(await db.weeklyHours.create({ data: input, select: HOURS }));
  } catch (error) {
    if (isExclusionViolation(error)) throw new AppError('HOURS_OVERLAP', { cause: error });
    throw error;
  }
}

export const locationRepository: LocationRepository = {
  async list() {
    const rows = await db.location.findMany({ select: LOCATION, orderBy: [{ active: 'desc' }, { name: 'asc' }] });
    return rows.map((row) => LocationRowSchema.parse(row));
  },

  async findById(id) {
    const row = await db.location.findUnique({ where: { id }, select: LOCATION });
    return row ? LocationRowSchema.parse(row) : null;
  },

  async create(data) {
    return LocationRowSchema.parse(await db.location.create({ data, select: LOCATION }));
  },

  async update({ id, version }, data) {
    stale((await db.location.updateMany({ where: { id, version }, data: { ...data, version: { increment: 1 } } })).count);
  },

  async setActive({ id, version }, active) {
    stale((await db.location.updateMany({ where: { id, version }, data: { active, version: { increment: 1 } } })).count);
  },

  countUpcomingAppointments: (locationId, now) =>
    db.appointment.count({ where: { locationId, startsAt: { gt: now }, status: { in: ['PENDING', 'CONFIRMED'] } } }),

  async listHours() {
    const rows = await db.weeklyHours.findMany({ select: HOURS, orderBy: [{ weekday: 'asc' }, { startMinute: 'asc' }] });
    return rows.map((row) => WeeklyHoursRowSchema.parse(row));
  },

  addHours: insertHours,

  async deleteHours({ id, version }) {
    stale((await db.weeklyHours.deleteMany({ where: { id, version } })).count);
  },
};
