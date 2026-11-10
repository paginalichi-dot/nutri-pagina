import { describe, expect, it } from 'vitest';
import type { DirectoryVisit } from '../domain/patient-directory.schema';
import { createPatientDirectoryService } from './patient-directory.service';

const NOW = new Date('2026-11-15T15:00:00Z');
const base = { status: 'CONFIRMED', patientName: 'Ana Ficticia', patientPhone: '1100000000', patientEmail: 'ana@ejemplo.test', locationName: 'Centro', healthInsurance: null } as const;
const VISITS: DirectoryVisit[] = [
  { ...base, id: '00000000-0000-4000-8000-000000000001', startsAt: new Date('2026-10-01T13:00:00Z') },
  { ...base, id: '00000000-0000-4000-8000-000000000002', startsAt: new Date('2026-11-01T13:00:00Z') },
  { ...base, id: '00000000-0000-4000-8000-000000000003', startsAt: new Date('2026-11-20T13:00:00Z'), status: 'PENDING' },
];

const service = createPatientDirectoryService({ repository: { listAccounts: async () => [], listVisits: async () => VISITS }, clock: () => NOW });

describe('patientDirectoryService (US-43 CA-5)', () => {
  it('la ficha se encuentra por el id de la lista o por el de cualquiera de sus turnos', async () => {
    const [entry] = await service.list();
    expect(entry?.id).toBe(VISITS[2]?.id);
    const file = await service.file(VISITS[0]?.id ?? '');
    expect(file?.entry.name).toBe('Ana Ficticia');
    expect(file?.upcoming.map(({ id }) => id)).toEqual([VISITS[2]?.id]);
    expect(file?.past.map(({ id }) => id)).toEqual([VISITS[1]?.id, VISITS[0]?.id]);
  });

  it('una ficha que no existe da null', async () => {
    await expect(service.file('00000000-0000-4000-8000-000000000099')).resolves.toBeNull();
  });
});
