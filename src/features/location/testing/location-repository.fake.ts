import { randomUUID } from 'node:crypto';
import { AppError } from '@/lib/errors';
import type { WeeklyHoursRow } from '../domain/hours.schema';
import type { LocationRow } from '../domain/location.schema';
import type { LocationRepository } from '../repository/location.repository';

export type FakeLocationRepository = LocationRepository & { upcoming: Map<string, number> };

type HoursMethods = Pick<LocationRepository, 'listHours' | 'addHours' | 'deleteHours'>;

const weekRange = ({ weekday, startMinute, endMinute }: Pick<WeeklyHoursRow, 'weekday' | 'startMinute' | 'endMinute'>): [number, number] => [
  (weekday - 1) * 1440 + startMinute,
  (weekday - 1) * 1440 + endMinute,
];

const overlaps = (a: [number, number], b: [number, number]): boolean => a[0] < b[1] && b[0] < a[1];

function versioned<T extends { version: number }>(row: T | undefined, version: number): T {
  if (!row || row.version !== version) throw new AppError('STALE_VERSION');
  row.version += 1;
  return row;
}

function fakeHours(locations: Map<string, LocationRow>): HoursMethods {
  const hours = new Map<string, WeeklyHoursRow>();
  return {
    listHours: async () => [...hours.values()].sort((a, b) => a.weekday - b.weekday || a.startMinute - b.startMinute).map((row) => ({ ...row })),
    async addHours(input) {
      if (!locations.has(input.locationId)) throw new AppError('RELATION_NOT_FOUND');
      if ([...hours.values()].some((row) => overlaps(weekRange(row), weekRange(input)))) throw new AppError('HOURS_OVERLAP');
      const row = { ...input, id: randomUUID(), version: 1 };
      hours.set(row.id, row);
      return { ...row };
    },
    async deleteHours({ id, version }) {
      versioned(hours.get(id), version);
      hours.delete(id);
    },
  };
}

export function createFakeLocationRepository(): FakeLocationRepository {
  const locations = new Map<string, LocationRow>();
  const upcoming = new Map<string, number>();

  function assertUnique(candidate: Pick<LocationRow, 'id' | 'name' | 'kind'>): void {
    const clash = [...locations.values()].some(
      (row) => row.id !== candidate.id && (row.name.toLowerCase() === candidate.name.toLowerCase() || (row.kind === 'ONLINE' && candidate.kind === 'ONLINE'))
    );
    if (clash) throw new AppError('DUPLICATE');
  }

  return {
    ...fakeHours(locations),
    upcoming,
    list: async () => [...locations.values()].sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name)).map((row) => ({ ...row })),
    async findById(id) {
      const row = locations.get(id);
      return row ? { ...row } : null;
    },
    async create(data) {
      const row = { ...data, id: randomUUID(), active: true, version: 1 };
      assertUnique(row);
      locations.set(row.id, row);
      return { ...row };
    },
    async update({ id, version }, data) {
      assertUnique({ ...data, id });
      Object.assign(versioned(locations.get(id), version), data);
    },
    async setActive({ id, version }, active) {
      versioned(locations.get(id), version).active = active;
    },
    countUpcomingAppointments: async (locationId) => upcoming.get(locationId) ?? 0,
  };
}
