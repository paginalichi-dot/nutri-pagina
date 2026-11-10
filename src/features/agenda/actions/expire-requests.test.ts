import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushEmails } from '@/features/patient/testing/patient-contract';
import { aNewAppointment } from '../testing/agenda-builders';
import { fakeAgenda, outbox, seedAgenda } from '../testing/agenda-contract';
import { expireRequests } from './expire-requests';

vi.mock('next/server', async (importOriginal) => (await import('@/features/patient/testing/patient-contract')).nextServerModule(importOriginal));
vi.mock('@/lib/email/send-email', async () => (await import('../testing/agenda-contract')).emailModule);
vi.mock('../repository/agenda.repository', async () => ({ agendaRepository: (await import('../testing/agenda-contract')).fakeAgenda }));
vi.mock('@/features/auth/repository/admin.repository', async () => (await import('@/features/auth/testing/module-mocks')).fakeRepositoryModule());

const SECRET = 'secreto-del-cron-de-prueba';

describe('vencer solicitudes desde el cron (contrato, T-10 CA-2)', () => {
  let id: string;
  beforeEach(async () => {
    const { centro } = await seedAgenda();
    vi.stubEnv('CRON_SECRET', SECRET);
    id = await fakeAgenda.createAppointment(aNewAppointment(centro, { status: 'PENDING', source: 'ONLINE', startsAt: new Date('2026-11-07T20:00:00Z'), endsAt: new Date('2026-11-07T20:45:00Z') }));
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it.each([null, 'Bearer otro', SECRET])('con el header %o no hace nada (401)', async (header) => {
    await expect(expireRequests(header)).resolves.toBeNull();
    await expect(fakeAgenda.findAppointment(id)).resolves.toMatchObject({ status: 'PENDING' });
  });

  it('sin CRON_SECRET configurado nunca corre', async () => {
    vi.stubEnv('CRON_SECRET', '');
    await expect(expireRequests('Bearer ')).resolves.toBeNull();
  });

  it('con el secreto vence la solicitud y avisa al paciente', async () => {
    await expect(expireRequests(`Bearer ${SECRET}`)).resolves.toEqual({ notified: 1 });
    await expect(fakeAgenda.findAppointment(id)).resolves.toMatchObject({ status: 'CANCELLED' });
    await flushEmails();
    expect(outbox.map(({ subject }) => subject)).toEqual(['Tu turno con Lisandro López se canceló']);
  });
});
