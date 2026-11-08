import { type AppointmentDetail, isActiveStatus, type TimeRange } from '../domain/appointment.schema';
import type { BlockRow } from '../domain/block.schema';
import type { AgendaRepository, LocationSchedule } from '../repository/agenda.repository';
import { type FakeState, fakeAppointmentWrites, type Stored } from './agenda-fake-writes';

export type FakePlace = AppointmentDetail['place'] & { id: string; name: string } & LocationSchedule;

export type FakeAgendaRepository = AgendaRepository & {
  places: Map<string, FakePlace>;
  insurances: Map<string, string>;
  settings: { slotMinutes: number | null };
  reset(): void;
};

const overlaps = (a: TimeRange, b: TimeRange): boolean => a.startsAt < b.endsAt && b.startsAt < a.endsAt;

function detail(state: FakeState, row: Stored): AppointmentDetail {
  const { healthInsuranceId, ...data } = row;
  const place = state.places.get(row.locationId);
  const healthInsuranceName = healthInsuranceId ? (state.insurances.get(healthInsuranceId) ?? null) : null;
  const placeData = { kind: place?.kind ?? 'IN_PERSON', address: place?.address ?? null, directions: place?.directions ?? null, videoUrl: place?.videoUrl ?? null };
  return { ...data, locationName: place?.name ?? '', healthInsuranceName, place: placeData };
}

function fakeReads(state: FakeState): Omit<AgendaRepository, keyof ReturnType<typeof fakeAppointmentWrites> | 'inTransaction'> {
  const active = (): Stored[] => [...state.appointments.values()].filter((row) => isActiveStatus(row.status));
  return {
    listAppointments: async (range) => [...state.appointments.values()].filter((row) => overlaps(row, range)).sort((a, b) => +a.startsAt - +b.startsAt).map((row) => detail(state, row)),
    async findAppointment(id) {
      const row = state.appointments.get(id);
      return row ? detail(state, row) : null;
    },
    listBusy: async (range, ignoreId) => [...active().filter((row) => row.id !== ignoreId), ...state.blocks.values()].filter((row) => overlaps(row, range)).map(({ startsAt, endsAt }) => ({ startsAt, endsAt })),
    async findSchedule(locationId) {
      const place = state.places.get(locationId);
      return place ? { active: place.active, hours: place.hours } : null;
    },
    listActiveHours: async () => [...state.places.values()].filter((place) => place.active).flatMap((place) => place.hours),
    async findNextActive(now) {
      const row = active().filter((candidate) => candidate.startsAt >= now).sort((a, b) => +a.startsAt - +b.startsAt)[0];
      return row ? detail(state, row) : null;
    },
    listContactsBefore: async (before) =>
      [...state.appointments.values()].filter((row) => row.status !== 'CANCELLED' && row.startsAt < before).map((row) => ({ phone: row.patientPhone, email: row.patientEmail })),
    getSlotMinutes: async () => state.settings.slotMinutes,
    async findActiveByEmail(email, now) {
      const row = active().find((candidate) => candidate.patientEmail === email && candidate.startsAt > now);
      return row ? { startsAt: row.startsAt, endsAt: row.endsAt } : null;
    },
    countActiveAppointments: async (range) => active().filter((row) => overlaps(row, range)).length,
    listBlocks: async (range) => [...state.blocks.values()].filter((row) => overlaps(row, range)).map((row) => ({ ...row })),
  };
}

export function createFakeAgendaRepository(): FakeAgendaRepository {
  const state: FakeState = { places: new Map(), insurances: new Map(), settings: { slotMinutes: null }, appointments: new Map(), blocks: new Map<string, BlockRow>() };
  const repository: FakeAgendaRepository = {
    places: state.places,
    insurances: state.insurances,
    settings: state.settings,
    reset() {
      [state.places, state.insurances, state.appointments, state.blocks].forEach((map) => map.clear());
      state.settings.slotMinutes = null;
    },
    ...fakeReads(state),
    ...fakeAppointmentWrites(state),
    inTransaction: (work) => work(repository),
  };
  return repository;
}
