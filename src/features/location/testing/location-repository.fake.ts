import { randomUUID } from 'node:crypto';
import { AppError } from '@/lib/errors';
import type { LocationData, LocationRow } from '../domain/location.schema';
import type { MonthActivity } from '../domain/new-location.schema';
import type { LocationRepository } from '../repository/location.repository';
import { fakeHours, versioned } from './location-hours.fake';

export type FakeLocationRepository = LocationRepository & { upcoming: Map<string, number>; activity: Map<string, MonthActivity> };

type Creator = { assertUnique(candidate: Pick<LocationRow, 'id' | 'name' | 'kind'>): void; create(data: LocationData, active?: boolean): Promise<LocationRow> };

function fakeLocations(locations: Map<string, LocationRow>): Creator {
  function assertUnique(candidate: Pick<LocationRow, 'id' | 'name' | 'kind'>): void {
    const clash = [...locations.values()].some(
      (row) => row.id !== candidate.id && (row.name.toLowerCase() === candidate.name.toLowerCase() || (row.kind === 'ONLINE' && candidate.kind === 'ONLINE'))
    );
    if (clash) throw new AppError('DUPLICATE');
  }
  return {
    assertUnique,
    async create(data, active = true) {
      const row = { ...data, id: randomUUID(), active, version: 1 };
      assertUnique(row);
      locations.set(row.id, row);
      return { ...row };
    },
  };
}

export function createFakeLocationRepository(): FakeLocationRepository {
  const locations = new Map<string, LocationRow>();
  const upcoming = new Map<string, number>();
  const activity = new Map<string, MonthActivity>();
  const { assertFree, ...hours } = fakeHours(locations);
  const { assertUnique, create } = fakeLocations(locations);

  return {
    ...hours,
    upcoming,
    activity,
    list: async () => [...locations.values()].sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name)).map((row) => ({ ...row })),
    async findById(id) {
      const row = locations.get(id);
      return row ? { ...row } : null;
    },
    create: (data) => create(data),
    async createWithHours(data, active, ranges) {
      assertUnique({ ...data, id: '' });
      assertFree(ranges);
      const row = await create(data, active);
      for (const range of ranges) await hours.addHours({ ...range, locationId: row.id });
      return row;
    },
    async update({ id, version }, data) {
      assertUnique({ ...data, id });
      Object.assign(versioned(locations.get(id), version), data);
    },
    async setActive({ id, version }, active) {
      versioned(locations.get(id), version).active = active;
    },
    countUpcomingAppointments: async (locationId) => upcoming.get(locationId) ?? 0,
    monthActivity: async (locationId) => activity.get(locationId) ?? { appointments: 0, blocks: [] },
  };
}
