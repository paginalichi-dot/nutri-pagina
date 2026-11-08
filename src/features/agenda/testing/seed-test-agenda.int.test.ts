import { describe, expect, it } from 'vitest';
import { db } from '@/lib/db';
import { resetAgendaTables } from '@/test/agenda-tables';
import { seedTestAgenda } from './seed-test-agenda';

describe('seedTestAgenda (integración)', () => {
  it('carga una agenda ficticia y se puede correr dos veces sin duplicar', async () => {
    await resetAgendaTables();
    await seedTestAgenda('test');
    await seedTestAgenda('test');
    await expect(db.location.count()).resolves.toBe(2);
    await expect(db.weeklyHours.count()).resolves.toBe(10);
    await expect(db.healthInsurance.count()).resolves.toBe(2);
    await expect(db.agendaSettings.findUnique({ where: { id: 1 } })).resolves.toMatchObject({ slotMinutes: 45 });
  });

  it('en tests arranca de una agenda limpia', async () => {
    await db.location.create({ data: { name: 'Sobrante', kind: 'IN_PERSON', address: 'Calle 9' } });
    await seedTestAgenda('test');
    await expect(db.location.findFirst({ where: { name: 'Sobrante' } })).resolves.toBeNull();
  });

  it('en desarrollo no toca una agenda que ya tiene ubicaciones propias', async () => {
    await resetAgendaTables();
    await db.location.create({ data: { name: 'Propia', kind: 'IN_PERSON', address: 'Calle 1' } });
    await seedTestAgenda('development');
    await expect(db.location.count()).resolves.toBe(1);
  });

  it('se niega con APP_ENV=production', async () => {
    await expect(seedTestAgenda('production')).rejects.toThrow('El seed sólo carga datos ficticios: no corre con APP_ENV=production.');
  });
});
