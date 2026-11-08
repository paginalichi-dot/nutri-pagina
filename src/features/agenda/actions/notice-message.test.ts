import { describe, expect, it } from 'vitest';
import { noticeMessage } from './notice-message';

describe('noticeMessage', () => {
  it.each([
    [true, 'Hecho. Le mandamos un email al paciente.'],
    [false, 'Hecho. No pudimos mandar el email: avisale por WhatsApp.'],
    [null, 'Hecho. No tiene email: avisale por WhatsApp.'],
  ])('con emailSent=%s dice "%s"', (emailSent, message) => {
    expect(noticeMessage({ done: 'Hecho.', emailSent })).toBe(message);
  });

  it('avisa si el email ya tenía otro turno', () => {
    expect(noticeMessage({ done: 'Hecho.', emailSent: true, duplicateStartsAt: new Date('2026-11-09T12:00:00Z') })).toBe(
      'Hecho. Le mandamos un email al paciente. Ojo: ese email ya tenía un turno el lunes, 9 de noviembre a las 09:00.'
    );
  });
});
