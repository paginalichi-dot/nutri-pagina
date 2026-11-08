import { beforeEach, describe, expect, it } from 'vitest';
import { type AgendaSetup, agendaSetup, MONDAY, MONDAY_9, PATIENT } from '../testing/agenda-service.fixture';

const MONDAY_16 = new Date('2026-11-09T19:00:00.000Z');

describe('agendaService: cancelar, asistencia y reprogramar', () => {
  let setup: AgendaSetup;
  let id: string;
  beforeEach(async () => {
    setup = await agendaSetup();
    id = (await setup.service.createManual({ locationId: setup.centro, startsAt: MONDAY_9, ...PATIENT })).id;
    setup.sent.length = 0;
  });

  it('US-17 CA-1 y CA-2: cancela, libera el horario, avisa por email y arma el WhatsApp', async () => {
    const notice = await setup.service.cancel({ id, version: 1 });
    expect(notice.emailSent).toBe(true);
    expect(decodeURIComponent(notice.whatsappUrl)).toContain('Hola Ana, tu turno del lunes, 9 de noviembre a las 09:00 se canceló.');
    expect(setup.sent[0]).toMatchObject({ subject: 'Tu turno con Lisandro López se canceló' });
    expect(setup.sent[0]?.attachments).toBeUndefined();
    await expect(setup.service.appointment(id)).resolves.toMatchObject({ status: 'CANCELLED', version: 2 });
    await expect(setup.service.slots({ locationId: setup.centro, day: MONDAY }, 'panel')).resolves.toContainEqual(MONDAY_9);
  });

  it('US-17 CA-4: no cancela dos veces ni un turno que ya empezó', async () => {
    await setup.service.cancel({ id, version: 1 });
    await expect(setup.service.cancel({ id, version: 2 })).rejects.toMatchObject({ code: 'INVALID_TRANSITION' });
    const other = (await setup.service.createManual({ locationId: setup.online, startsAt: MONDAY_16, ...PATIENT })).id;
    setup.clock.now = new Date('2026-11-09T19:10:00Z');
    await expect(setup.service.cancel({ id: other, version: 1 })).rejects.toMatchObject({ code: 'INVALID_TRANSITION' });
  });

  it('US-17 CA-4: con una versión vieja da STALE_VERSION', async () => {
    await expect(setup.service.cancel({ id, version: 7 })).rejects.toMatchObject({ code: 'STALE_VERSION' });
  });

  it('US-17 CA-3: marca asistió o ausente sólo cuando el turno ya empezó', async () => {
    await expect(setup.service.markAttendance({ id, version: 1 }, true)).rejects.toMatchObject({ code: 'INVALID_TRANSITION' });
    setup.clock.now = new Date('2026-11-09T12:30:00Z');
    await setup.service.markAttendance({ id, version: 1 }, false);
    await expect(setup.service.appointment(id)).resolves.toMatchObject({ status: 'NO_SHOW' });
    await expect(setup.service.markAttendance({ id, version: 2 }, true)).rejects.toMatchObject({ code: 'INVALID_TRANSITION' });
  });

  it('US-18 CA-1 a CA-3: reprograma a otra ubicación, libera el horario viejo y avisa con antes y ahora', async () => {
    const notice = await setup.service.reschedule({ id, version: 1 }, { locationId: setup.online, startsAt: MONDAY_16 });
    await expect(setup.service.appointment(id)).resolves.toMatchObject({ locationId: setup.online, startsAt: MONDAY_16, status: 'CONFIRMED', version: 2 });
    expect(setup.sent[0]?.text).toContain('Antes: lunes, 9 de noviembre a las 09:00');
    expect(setup.sent[0]?.text).toContain('Ahora: lunes, 9 de noviembre a las 16:00');
    expect(setup.sent[0]?.text).toContain('Entrar a la videollamada: https://meet.example.test/sala');
    expect(decodeURIComponent(notice.whatsappUrl)).toContain('tu turno pasó del lunes, 9 de noviembre a las 09:00 al lunes, 9 de noviembre a las 16:00');
    await expect(setup.service.slots({ locationId: setup.centro, day: MONDAY }, 'panel')).resolves.toContainEqual(MONDAY_9);
  });

  it('US-18 CA-2: a un horario ocupado da SLOT_TAKEN y el turno queda donde estaba', async () => {
    await setup.service.createManual({ locationId: setup.online, startsAt: MONDAY_16, ...PATIENT, email: null });
    await expect(setup.service.reschedule({ id, version: 1 }, { locationId: setup.online, startsAt: MONDAY_16 })).rejects.toMatchObject({ code: 'SLOT_TAKEN' });
    await expect(setup.service.appointment(id)).resolves.toMatchObject({ startsAt: MONDAY_9, version: 1 });
  });

  it('US-18 CA-4: no reprograma un turno cancelado', async () => {
    await setup.service.cancel({ id, version: 1 });
    await expect(setup.service.reschedule({ id, version: 2 }, { locationId: setup.online, startsAt: MONDAY_16 })).rejects.toMatchObject({ code: 'INVALID_TRANSITION' });
  });
});
