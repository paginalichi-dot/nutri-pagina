import { describe, expect, it } from 'vitest';
import { db } from '@/lib/db';
import { resetAgendaTables } from '@/test/agenda-tables';
import { settingsRepositoryBehavior } from '../testing/settings-repository.behavior';
import { settingsRepository } from './settings.repository';

settingsRepositoryBehavior('Prisma', async () => {
  await resetAgendaTables();
  return settingsRepository;
});

describe('settingsRepository (integración)', () => {
  it.each([
    ['una duración menor a 15', { id: 1, slotMinutes: 10 }],
    ['una duración que no es múltiplo de 5', { id: 1, slotMinutes: 47 }],
    ['una segunda fila de ajustes', { id: 2, slotMinutes: 45 }],
  ])('la base rechaza %s', async (_caso, data) => {
    await resetAgendaTables();
    await expect(db.agendaSettings.create({ data })).rejects.toThrow();
  });

  it.each([['Particular'], ['  particular '], ['  ']])('la base rechaza la obra social «%s»', async (name) => {
    await resetAgendaTables();
    await expect(db.healthInsurance.create({ data: { name } })).rejects.toThrow();
  });
});
