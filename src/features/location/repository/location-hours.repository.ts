import { db } from '@/lib/db';
import { withTransaction } from '@/lib/db/transaction';
import { isExclusionViolation } from '@/lib/db-errors';
import { AppError } from '@/lib/errors';
import type { RecordRef } from '@/lib/record-ref';
import { type HoursRange, type MinuteRange, type WeeklyHoursInput, type WeeklyHoursRow, WeeklyHoursRowSchema } from '../domain/hours.schema';
import { type LocationData, type LocationRow, LocationRowSchema } from '../domain/location.schema';
import type { Instants, MonthActivity } from '../domain/new-location.schema';

export const LOCATION = { id: true, name: true, kind: true, address: true, directions: true, mapUrl: true, videoUrl: true, active: true, version: true } as const;
const HOURS = { id: true, locationId: true, weekday: true, startMinute: true, endMinute: true, version: true } as const;

export function stale(count: number): void {
  if (count === 0) throw new AppError('STALE_VERSION');
}

async function overlapAware<T>(work: () => Promise<T>): Promise<T> {
  try {
    return await work();
  } catch (error) {
    if (isExclusionViolation(error)) throw new AppError('HOURS_OVERLAP', { cause: error });
    throw error;
  }
}

export const hoursRepository = {
  async listHours(): Promise<WeeklyHoursRow[]> {
    const rows = await db.weeklyHours.findMany({ select: HOURS, orderBy: [{ weekday: 'asc' }, { startMinute: 'asc' }] });
    return rows.map((row) => WeeklyHoursRowSchema.parse(row));
  },

  addHours: (input: WeeklyHoursInput): Promise<WeeklyHoursRow> => overlapAware(async () => WeeklyHoursRowSchema.parse(await db.weeklyHours.create({ data: input, select: HOURS }))),

  updateHours: ({ id, version }: RecordRef, range: MinuteRange): Promise<void> =>
    overlapAware(async () => stale((await db.weeklyHours.updateMany({ where: { id, version }, data: { ...range, version: { increment: 1 } } })).count)),

  async deleteHours({ id, version }: RecordRef): Promise<void> {
    stale((await db.weeklyHours.deleteMany({ where: { id, version } })).count);
  },

  createWithHours: (data: LocationData, active: boolean, hours: HoursRange[]): Promise<LocationRow> =>
    overlapAware(() =>
      withTransaction(async (tx) => {
        const row = await tx.location.create({ data: { ...data, active }, select: LOCATION });
        await tx.weeklyHours.createMany({ data: hours.map((range) => ({ ...range, locationId: row.id })) });
        return LocationRowSchema.parse(row);
      })
    ),

  async monthActivity(locationId: string, { startsAt, endsAt }: Instants): Promise<MonthActivity> {
    const overlapping = { startsAt: { lt: endsAt }, endsAt: { gt: startsAt } };
    const [appointments, blocks] = await Promise.all([
      db.appointment.count({ where: { locationId, status: { not: 'CANCELLED' }, startsAt: { gte: startsAt, lt: endsAt } } }),
      db.timeBlock.findMany({ where: overlapping, select: { startsAt: true, endsAt: true }, orderBy: { startsAt: 'asc' } }),
    ]);
    return { appointments, blocks };
  },
};
