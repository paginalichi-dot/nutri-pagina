import { describe, expect, it } from 'vitest';
import type { DirectoryAccount, DirectoryVisit } from '../domain/patient-directory.schema';
import { buildDirectory, patientStatus } from './patient-directory';

const NOW = new Date('2026-11-15T15:00:00Z');
let seq = 0;
const id = (): string => `00000000-0000-4000-8000-${String(++seq).padStart(12, '0')}`;

function visit(startsAt: string, overrides: Partial<DirectoryVisit> = {}): DirectoryVisit {
  return { id: id(), startsAt: new Date(startsAt), status: 'CONFIRMED', patientName: 'Ana Ficticia', patientPhone: '11 2345-6789', patientEmail: 'ana@ejemplo.test', locationName: 'Centro', healthInsurance: null, ...overrides };
}

const ACCOUNT: DirectoryAccount = { id: id(), name: 'Ana Cuenta', email: 'ana@ejemplo.test', phone: '11 0000-0000', createdAt: new Date('2025-01-10T12:00:00Z') };

describe('lista de pacientes (US-43)', () => {
  it('CA-1: junta la cuenta con sus turnos por email y agrupa por teléfono a quien no tiene email', () => {
    const visits = [visit('2026-10-01T13:00:00Z'), visit('2026-10-02T13:00:00Z', { patientEmail: null, patientName: 'Beto Sin Mail', patientPhone: '11-5555-0000' }), visit('2026-10-20T13:00:00Z', { patientEmail: null, patientName: 'Beto S.', patientPhone: '1155550000' })];
    const list = buildDirectory([ACCOUNT], visits, NOW);
    expect(list.map(({ entry, visits: own }) => [entry.name, entry.hasAccount, own.length])).toEqual([
      ['Ana Cuenta', true, 1],
      ['Beto S.', false, 2],
    ]);
    expect(list[0]?.entry).toMatchObject({ id: ACCOUNT.id, phone: '11 0000-0000' });
    expect(list[1]?.entry).toMatchObject({ id: visits[2]?.id, email: null, phone: '1155550000' });
  });

  it('CA-2: último turno es el último que pasó sin cancelarse; próximo, el próximo pendiente o confirmado', () => {
    const visits = [
      visit('2026-11-01T13:00:00Z'),
      visit('2026-11-10T13:00:00Z', { status: 'CANCELLED' }),
      visit('2026-11-15T14:00:00Z', { status: 'NO_SHOW' }),
      visit('2026-11-20T13:00:00Z', { status: 'CANCELLED' }),
      visit('2026-11-22T13:00:00Z', { status: 'PENDING' }),
    ];
    const [group] = buildDirectory([], visits, NOW);
    expect(group?.entry.lastVisit).toEqual(new Date('2026-11-15T14:00:00Z'));
    expect(group?.entry.nextVisit).toEqual(new Date('2026-11-22T13:00:00Z'));
  });

  it.each([
    ['primer turno este mes (aunque sea más adelante)', { since: new Date('2026-11-28T13:00:00Z'), lastVisit: null, nextVisit: new Date('2026-11-28T13:00:00Z') }, 'NEW'],
    ['el 1 a la medianoche argentina ya es este mes', { since: new Date('2026-11-01T03:00:00Z'), lastVisit: null, nextVisit: null }, 'NEW'],
    ['el 31 a las 23:59 argentinas es el mes anterior', { since: new Date('2026-11-01T02:59:00Z'), lastVisit: new Date('2026-11-01T02:59:00Z'), nextVisit: null }, 'ACTIVE'],
    ['sin turnos en más de 6 meses y ninguno por venir', { since: new Date('2025-01-01T13:00:00Z'), lastVisit: new Date('2026-05-14T13:00:00Z'), nextVisit: null }, 'INACTIVE'],
    ['justo 6 meses', { since: new Date('2025-01-01T13:00:00Z'), lastVisit: new Date('2026-05-15T15:00:00Z'), nextVisit: null }, 'ACTIVE'],
    ['viejo pero con uno por venir', { since: new Date('2025-01-01T13:00:00Z'), lastVisit: null, nextVisit: new Date('2026-12-01T13:00:00Z') }, 'ACTIVE'],
    ['cuenta vieja sin turnos', { since: new Date('2025-01-01T13:00:00Z'), lastVisit: null, nextVisit: null }, 'INACTIVE'],
  ] as const)('CA-3: %s → %s', (_caso, facts, expected) => {
    expect(patientStatus(facts, NOW)).toBe(expected);
  });

  it('CA-3: la cuenta creada este mes sin turnos es nueva', () => {
    const [group] = buildDirectory([{ ...ACCOUNT, createdAt: new Date('2026-11-03T12:00:00Z') }], [], NOW);
    expect(group?.entry).toMatchObject({ status: 'NEW', lastVisit: null, nextVisit: null });
  });
});
