import { beforeEach, describe, expect, it } from 'vitest';
import { aNewAppointment } from '../testing/agenda-builders';
import { type AgendaSetup, agendaSetup, MONDAY_9, PATIENT } from '../testing/agenda-service.fixture';

describe('agendaService: confirmar un pendiente (US-23)', () => {
  let setup: AgendaSetup;
  let id: string;
  beforeEach(async () => {
    setup = await agendaSetup();
    id = await setup.repository.createAppointment(aNewAppointment(setup.centro, { status: 'PENDING', source: 'ONLINE' }));
  });

  it('CA-1 y CA-2: pasa a confirmado, manda el email con el .ics y arma el WhatsApp', async () => {
    const notice = await setup.service.confirm({ id, version: 1 });
    expect(notice.emailSent).toBe(true);
    expect(setup.sent[0]).toMatchObject({ to: 'ana@ejemplo.test', subject: 'Tu turno con Lisandro López está confirmado', attachments: [{ filename: 'turno.ics' }] });
    expect(decodeURIComponent(notice.whatsappUrl)).toContain('Hola Ana, te confirmo tu turno');
    await expect(setup.service.appointment(id)).resolves.toMatchObject({ status: 'CONFIRMED', version: 2 });
  });

  it('CA-2: si el email falla, el turno queda confirmado y se informa', async () => {
    setup.emailWorks.value = false;
    await expect(setup.service.confirm({ id, version: 1 })).resolves.toMatchObject({ emailSent: false });
    await expect(setup.service.appointment(id)).resolves.toMatchObject({ status: 'CONFIRMED' });
  });

  it('CA-3: un turno ya confirmado da INVALID_TRANSITION', async () => {
    const confirmed = (await setup.service.createManual({ locationId: setup.online, startsAt: new Date('2026-11-09T19:00:00.000Z'), ...PATIENT })).id;
    await expect(setup.service.confirm({ id: confirmed, version: 1 })).rejects.toMatchObject({ code: 'INVALID_TRANSITION' });
  });

  it('CA-3: un pendiente que ya empezó da INVALID_TRANSITION', async () => {
    setup.clock.now = MONDAY_9;
    await expect(setup.service.confirm({ id, version: 1 })).rejects.toMatchObject({ code: 'INVALID_TRANSITION' });
  });

  it('CA-3: con una versión vieja da STALE_VERSION y no cambia nada', async () => {
    await expect(setup.service.confirm({ id, version: 9 })).rejects.toMatchObject({ code: 'STALE_VERSION' });
    await expect(setup.service.appointment(id)).resolves.toMatchObject({ status: 'PENDING', version: 1 });
  });
});
