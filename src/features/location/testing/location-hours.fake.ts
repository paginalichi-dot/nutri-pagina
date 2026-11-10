import { randomUUID } from 'node:crypto';
import { AppError } from '@/lib/errors';
import type { WeeklyHoursRow } from '../domain/hours.schema';
import type { LocationRow } from '../domain/location.schema';
import type { LocationRepository } from '../repository/location.repository';

type Range = Pick<WeeklyHoursRow, 'weekday' | 'startMinute' | 'endMinute'>;
export type HoursMethods = Pick<LocationRepository, 'listHours' | 'addHours' | 'updateHours' | 'deleteHours'> & { assertFree(ranges: Range[], except?: string): void };

const weekRange = ({ weekday, startMinute, endMinute }: Range): [number, number] => [(weekday - 1) * 1440 + startMinute, (weekday - 1) * 1440 + endMinute];
const overlaps = (a: Range, b: Range): boolean => weekRange(a)[0] < weekRange(b)[1] && weekRange(b)[0] < weekRange(a)[1];

export function versioned<T extends { version: number }>(row: T | undefined, version: number): T {
  if (!row || row.version !== version) throw new AppError('STALE_VERSION');
  row.version += 1;
  return row;
}

export function fakeHours(locations: Map<string, LocationRow>): HoursMethods {
  const hours = new Map<string, WeeklyHoursRow>();
  function assertFree(ranges: Range[], except = ''): void {
    const taken = [...hours.values()].filter(({ id }) => id !== except);
    if (ranges.some((range, index) => [...taken, ...ranges.slice(index + 1)].some((other) => overlaps(range, other)))) throw new AppError('HOURS_OVERLAP');
  }
  return {
    assertFree,
    listHours: async () => [...hours.values()].sort((a, b) => a.weekday - b.weekday || a.startMinute - b.startMinute).map((row) => ({ ...row })),
    async addHours(input) {
      if (!locations.has(input.locationId)) throw new AppError('RELATION_NOT_FOUND');
      assertFree([input]);
      const row = { ...input, id: randomUUID(), version: 1 };
      hours.set(row.id, row);
      return { ...row };
    },
    async updateHours({ id, version }, range) {
      const row = hours.get(id);
      if (row) assertFree([{ ...row, ...range }], id);
      Object.assign(versioned(row, version), range);
    },
    async deleteHours({ id, version }) {
      versioned(hours.get(id), version);
      hours.delete(id);
    },
  };
}
