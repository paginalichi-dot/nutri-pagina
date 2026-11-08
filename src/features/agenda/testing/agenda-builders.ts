import type { TimeRange } from '../domain/appointment.schema';
import type { AgendaRepository, NewAppointment } from '../repository/agenda.repository';

export type PlaceSeed = { name: string; kind: 'IN_PERSON' | 'ONLINE'; hours: { weekday: number; startMinute: number; endMinute: number }[]; active?: boolean };

export type AgendaFixture = {
  repository: AgendaRepository;
  addPlace(seed: PlaceSeed): Promise<string>;
  addInsurance(name: string): Promise<string>;
  setSlotMinutes(minutes: number): Promise<void>;
};

export const CENTRO: PlaceSeed = { name: 'Consultorio Centro', kind: 'IN_PERSON', hours: [{ weekday: 1, startMinute: 540, endMinute: 780 }] };
export const ONLINE: PlaceSeed = { name: 'Online', kind: 'ONLINE', hours: [{ weekday: 1, startMinute: 960, endMinute: 1080 }] };

export const PLACE_DATA = {
  IN_PERSON: { address: 'Calle Falsa 123', directions: 'Piso 2', videoUrl: null },
  ONLINE: { address: null, directions: null, videoUrl: 'https://meet.example.test/sala' },
} as const;

export function rangeAt(iso: string, minutes = 45): TimeRange {
  const startsAt = new Date(iso);
  return { startsAt, endsAt: new Date(startsAt.getTime() + minutes * 60_000) };
}

export function aNewAppointment(locationId: string, overrides: Partial<NewAppointment> = {}): NewAppointment {
  return {
    locationId,
    ...rangeAt('2026-11-09T12:00:00.000Z'),
    status: 'CONFIRMED',
    source: 'PANEL',
    patientName: 'Ana Prueba',
    patientPhone: '11 2345-6789',
    patientEmail: 'ana@ejemplo.test',
    healthInsuranceId: null,
    ...overrides,
  };
}
