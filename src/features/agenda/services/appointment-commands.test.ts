import { beforeEach, describe, expect, it } from 'vitest';
import { type AgendaSetup, agendaSetup, MONDAY_9, PATIENT } from '../testing/agenda-service.fixture';

const LATER = new Date('2026-11-09T12:45:00.000Z');

describe('agendaService: turnos cargados a mano', () => {
  let setup: AgendaSetup;
  beforeEach(async () => {
    setup = await agendaSetup();
  });

  it('US-16 CA-2 y CA-4: nace confirmado y el paciente recibe el email con el .ics', async () => {
    const result = await setup.service.createManual({ locationId: setup.centro, startsAt: MONDAY_9, ...PATIENT, healthInsuranceId: setup.insurance });
    expect(result).toMatchObject({ emailSent: true, duplicateStartsAt: null });
    await expect(setup.service.appointment(result.id)).resolves.toMatchObject({ status: 'CONFIRMED', source: 'PANEL', healthInsuranceName: 'Prepaga Uno', endsAt: LATER });
    expect(setup.sent).toHaveLength(1);
    expect(setup.sent[0]).toMatchObject({ to: 'ana@ejemplo.test', subject: 'Tu turno con Lisandro López está confirmado', attachments: [{ filename: 'turno.ics' }] });
  });

  it('US-16 CA-5: devuelve el link de WhatsApp con el mensaje armado', async () => {
    const { whatsappUrl } = await setup.service.createManual({ locationId: setup.centro, startsAt: MONDAY_9, ...PATIENT });
    expect(decodeURIComponent(whatsappUrl)).toBe(
      'https://wa.me/5491123456789?text=Hola Ana, te confirmo tu turno con Lisandro López el lunes, 9 de noviembre a las 09:00. Lugar: Consultorio Centro, Calle Falsa 123 (Piso 2).'
    );
  });

  it('US-16 CA-1: sin email no manda nada', async () => {
    await expect(setup.service.createManual({ locationId: setup.centro, startsAt: MONDAY_9, ...PATIENT, email: null })).resolves.toMatchObject({ emailSent: null });
    expect(setup.sent).toEqual([]);
  });

  it('US-16 CA-3: si el email ya tiene un turno activo, avisa pero guarda igual', async () => {
    await setup.service.createManual({ locationId: setup.centro, startsAt: MONDAY_9, ...PATIENT });
    const second = await setup.service.createManual({ locationId: setup.centro, startsAt: LATER, ...PATIENT });
    expect(second.duplicateStartsAt).toEqual(MONDAY_9);
  });

  it('US-16 CA-6: si el email falla, el turno queda guardado y se informa', async () => {
    setup.emailWorks.value = false;
    const { id, emailSent } = await setup.service.createManual({ locationId: setup.centro, startsAt: MONDAY_9, ...PATIENT });
    expect(emailSent).toBe(false);
    await expect(setup.service.appointment(id)).resolves.toMatchObject({ status: 'CONFIRMED' });
  });

  it.each([
    ['un horario que no está en la grilla', new Date('2026-11-09T12:10:00.000Z'), 'SLOT_TAKEN'],
    ['un horario fuera de la franja', new Date('2026-11-09T17:00:00.000Z'), 'SLOT_TAKEN'],
    ['un horario que ya pasó', new Date('2026-11-06T12:00:00.000Z'), 'SLOT_TOO_SOON'],
  ])('US-16 CA-6: rechaza %s', async (_caso, startsAt, code) => {
    await expect(setup.service.createManual({ locationId: setup.centro, startsAt, ...PATIENT })).rejects.toMatchObject({ code });
  });

  it('US-16 CA-6: un horario ya tomado, aun en otra ubicación, da SLOT_TAKEN', async () => {
    await setup.service.createManual({ locationId: setup.centro, startsAt: MONDAY_9, ...PATIENT });
    await expect(setup.service.createManual({ locationId: setup.centro, startsAt: MONDAY_9, ...PATIENT, email: null })).rejects.toMatchObject({ code: 'SLOT_TAKEN' });
  });

  it('US-16: sin límite de 12 h: Lisandro carga un turno para dentro de una hora', async () => {
    setup.clock.now = new Date('2026-11-09T11:00:00Z');
    await expect(setup.service.createManual({ locationId: setup.centro, startsAt: MONDAY_9, ...PATIENT })).resolves.toMatchObject({ emailSent: true });
  });
});
