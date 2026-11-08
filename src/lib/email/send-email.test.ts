import { afterEach, describe, expect, it, vi } from 'vitest';
import { createResendSender, type EmailMessage, emailSenderFromEnv } from './send-email';

const MESSAGE: EmailMessage = {
  to: 'paciente@ejemplo.test',
  subject: 'Turno confirmado',
  html: '<p>Hola</p>',
  text: 'Hola',
  attachments: [{ filename: 'turno.ics', content: 'QkVHSU4=' }],
};

const okFetcher = vi.fn(async () => ({ ok: true, status: 200 }));

describe('createResendSender', () => {
  afterEach(() => {
    okFetcher.mockClear();
  });

  it('manda el email a la API de Resend con la clave y el remitente', async () => {
    const send = createResendSender({ apiKey: 're_prueba', from: 'Lisandro <hola@ejemplo.test>', fetcher: okFetcher });
    await expect(send(MESSAGE)).resolves.toBe(true);
    expect(okFetcher).toHaveBeenCalledWith('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer re_prueba', 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'Lisandro <hola@ejemplo.test>', to: ['paciente@ejemplo.test'], subject: 'Turno confirmado', html: '<p>Hola</p>', text: 'Hola', attachments: MESSAGE.attachments }),
    });
  });

  it('si Resend responde con error devuelve false y loguea sin datos del paciente', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const send = createResendSender({ apiKey: 'k', from: 'f', fetcher: async () => ({ ok: false, status: 422 }) });
    await expect(send(MESSAGE)).resolves.toBe(false);
    expect(log).toHaveBeenCalledWith('No se pudo mandar un email:', { reason: 'Resend respondió 422' });
    expect(JSON.stringify(log.mock.calls)).not.toContain('paciente@ejemplo.test');
  });

  it('si la red falla devuelve false y loguea sólo el nombre del error', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const send = createResendSender({ apiKey: 'k', from: 'f', fetcher: async () => Promise.reject(new TypeError('paciente@ejemplo.test')) });
    await expect(send(MESSAGE)).resolves.toBe(false);
    expect(log).toHaveBeenCalledWith('No se pudo mandar un email:', { reason: 'TypeError' });
  });

  it('si lo que falla no es un Error, lo loguea como desconocido', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const send = createResendSender({ apiKey: 'k', from: 'f', fetcher: async () => Promise.reject('texto') });
    await expect(send(MESSAGE)).resolves.toBe(false);
    expect(log).toHaveBeenCalledWith('No se pudo mandar un email:', { reason: 'desconocido' });
  });
});

describe('emailSenderFromEnv', () => {
  it('sin RESEND_API_KEY no manda nada y avisa que falta la clave', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await expect(emailSenderFromEnv({})(MESSAGE)).resolves.toBe(false);
    expect(log).toHaveBeenCalledWith('No se pudo mandar un email:', { reason: 'falta RESEND_API_KEY' });
  });

  it('con la clave usa Resend y el remitente de prueba si falta EMAIL_FROM', async () => {
    const fetcher = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));
    await expect(emailSenderFromEnv({ RESEND_API_KEY: 're_x' })(MESSAGE)).resolves.toBe(true);
    expect(String(fetcher.mock.calls[0]?.[1]?.body)).toContain('"from":"Lisandro López <onboarding@resend.dev>"');
  });

  it('con EMAIL_FROM usa ese remitente', async () => {
    const fetcher = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));
    await emailSenderFromEnv({ RESEND_API_KEY: 're_x', EMAIL_FROM: 'Turnos <turnos@ejemplo.test>' })(MESSAGE);
    expect(String(fetcher.mock.calls[0]?.[1]?.body)).toContain('"from":"Turnos <turnos@ejemplo.test>"');
  });
});
