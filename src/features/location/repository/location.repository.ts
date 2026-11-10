import { db } from '@/lib/db';
import type { RecordRef } from '@/lib/record-ref';
import type { HoursRange, MinuteRange, WeeklyHoursInput, WeeklyHoursRow } from '../domain/hours.schema';
import { type LocationData, type LocationRow, LocationRowSchema } from '../domain/location.schema';
import type { Instants, MonthActivity } from '../domain/new-location.schema';
import { hoursRepository, LOCATION, stale } from './location-hours.repository';

export type LocationRepository = {
  list(): Promise<LocationRow[]>;
  findById(id: string): Promise<LocationRow | null>;
  create(data: LocationData): Promise<LocationRow>;
  createWithHours(data: LocationData, active: boolean, hours: HoursRange[]): Promise<LocationRow>;
  update(ref: RecordRef, data: LocationData): Promise<void>;
  setActive(ref: RecordRef, active: boolean): Promise<void>;
  countUpcomingAppointments(locationId: string, now: Date): Promise<number>;
  monthActivity(locationId: string, range: Instants): Promise<MonthActivity>;
  listHours(): Promise<WeeklyHoursRow[]>;
  addHours(input: WeeklyHoursInput): Promise<WeeklyHoursRow>;
  updateHours(ref: RecordRef, range: MinuteRange): Promise<void>;
  deleteHours(ref: RecordRef): Promise<void>;
};

export const locationRepository: LocationRepository = {
  ...hoursRepository,

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
};
