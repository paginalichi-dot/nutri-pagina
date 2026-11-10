import { AppError } from '@/lib/errors';
import type { MinuteRange, WeeklyHoursInput, WeeklyHoursRow } from '../domain/hours.schema';
import { type LocationInput, type LocationRow, locationData, type RecordRef } from '../domain/location.schema';
import type { LocationStats, NewLocationInput } from '../domain/new-location.schema';
import type { LocationWithHours, PublicLocation } from '../domain/public-location.schema';
import { type LocationRepository, locationRepository } from '../repository/location.repository';
import { argentinaMonthRange, locationStats } from './location-stats';

export type LocationService = {
  list(): Promise<LocationWithHours[]>;
  get(id: string): Promise<LocationWithHours>;
  listPublic(): Promise<PublicLocation[]>;
  create(input: LocationInput): Promise<LocationRow>;
  createWithHours(input: NewLocationInput): Promise<LocationRow>;
  stats(id: string): Promise<LocationStats>;
  update(ref: RecordRef, input: LocationInput): Promise<void>;
  setActive(ref: RecordRef, active: boolean): Promise<void>;
  addHours(input: WeeklyHoursInput): Promise<void>;
  updateHours(ref: RecordRef, range: MinuteRange): Promise<void>;
  deleteHours(ref: RecordRef): Promise<void>;
};

type Dependencies = { repository: LocationRepository; clock: () => Date };

const withHours = (location: LocationRow, hours: WeeklyHoursRow[]): LocationWithHours => ({
  ...location,
  hours: hours.filter((range) => range.locationId === location.id),
});

function toPublic({ id, name, kind, address, directions, mapUrl, hours }: LocationWithHours): PublicLocation {
  return { id, name, kind, address, directions, mapUrl, hours: hours.map(({ weekday, startMinute, endMinute }) => ({ weekday, startMinute, endMinute })) };
}

export function createLocationService({ repository, clock }: Dependencies): LocationService {
  async function list(): Promise<LocationWithHours[]> {
    const [locations, hours] = await Promise.all([repository.list(), repository.listHours()]);
    return locations.map((location) => withHours(location, hours));
  }

  return {
    list,
    async get(id) {
      const [location, hours] = await Promise.all([repository.findById(id), repository.listHours()]);
      if (!location) throw new AppError('NOT_FOUND', { entity: 'la ubicación' });
      return withHours(location, hours);
    },
    listPublic: async () => (await list()).filter(({ active }) => active).map(toPublic),
    create: (input) => repository.create(locationData(input)),
    createWithHours: ({ location, active, hours }) => repository.createWithHours(locationData(location), active, hours),
    async stats(id) {
      const month = argentinaMonthRange(clock());
      const [activity, hours] = await Promise.all([repository.monthActivity(id, month), repository.listHours()]);
      return locationStats(activity, hours.filter(({ locationId }) => locationId === id), month);
    },
    update: (ref, input) => repository.update(ref, locationData(input)),
    async setActive(ref, active) {
      if (!active && (await repository.countUpcomingAppointments(ref.id, clock())) > 0) throw new AppError('HAS_ACTIVE_APPOINTMENTS');
      await repository.setActive(ref, active);
    },
    addHours: async (input) => void (await repository.addHours(input)),
    updateHours: (ref, range) => repository.updateHours(ref, range),
    deleteHours: (ref) => repository.deleteHours(ref),
  };
}

export const locationService = createLocationService({ repository: locationRepository, clock: () => new Date() });
