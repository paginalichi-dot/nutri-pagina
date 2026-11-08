import { describe, expect, it } from 'vitest';
import { db } from '@/lib/db';
import { resetAgendaTables } from '@/test/agenda-tables';
import { IN_PERSON, ONLINE, locationRepositoryBehavior } from '../testing/location-repository.behavior';
import { locationRepository } from './location.repository';

locationRepositoryBehavior('Prisma', async () => {
  await resetAgendaTables();
  return locationRepository;
});

describe('locationRepository (integración)', () => {
  it('cuenta sólo los turnos pendientes o confirmados que todavía no empezaron', async () => {
    await resetAgendaTables();
    const { id: locationId } = await locationRepository.create(IN_PERSON);
    const patient = { locationId, source: 'PANEL', patientName: 'Ana Prueba', patientPhone: '1100000000' } as const;
    const at = (iso: string, minutes = 45): { startsAt: Date; endsAt: Date } => ({ startsAt: new Date(iso), endsAt: new Date(Date.parse(iso) + minutes * 60_000) });
    await db.appointment.createMany({
      data: [
        { ...patient, ...at('2026-11-10T12:00:00Z'), status: 'CONFIRMED' },
        { ...patient, ...at('2026-11-11T12:00:00Z'), status: 'PENDING' },
        { ...patient, ...at('2026-11-12T12:00:00Z'), status: 'CANCELLED' },
        { ...patient, ...at('2026-11-01T12:00:00Z'), status: 'CONFIRMED' },
      ],
    });
    await expect(locationRepository.countUpcomingAppointments(locationId, new Date('2026-11-07T12:00:00Z'))).resolves.toBe(2);
  });

  it.each([
    ['una presencial sin dirección', { ...IN_PERSON, address: null }],
    ['una online sin link', { ...ONLINE, videoUrl: null }],
    ['una online con dirección', { ...ONLINE, address: 'Calle 1' }],
    ['un mapa que no es de Google Maps', { ...IN_PERSON, mapUrl: 'https://otro.test/mapa' }],
    ['un link de videollamada sin https', { ...ONLINE, videoUrl: 'http://meet.example.test' }],
    ['un nombre en blanco', { ...IN_PERSON, name: '   ' }],
  ])('la base rechaza %s', async (_caso, data) => {
    await resetAgendaTables();
    await expect(db.location.create({ data })).rejects.toThrow();
  });

  it.each([
    ['un día fuera de 1 a 7', { weekday: 8, startMinute: 0, endMinute: 60 }],
    ['un fin anterior al inicio', { weekday: 1, startMinute: 600, endMinute: 540 }],
    ['un fin después de la medianoche', { weekday: 1, startMinute: 1380, endMinute: 1500 }],
  ])('la base rechaza una franja con %s', async (_caso, range) => {
    await resetAgendaTables();
    const { id: locationId } = await locationRepository.create(IN_PERSON);
    await expect(db.weeklyHours.create({ data: { locationId, ...range } })).rejects.toThrow();
  });
});
