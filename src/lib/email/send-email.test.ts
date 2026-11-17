import { describe, expect, it, vi } from 'vitest';
import { createGmailSender, type EmailMessage, emailSenderFromEnv } from './send-email';

const MESSAGE: EmailMessage = {
  to: 'paciente@ejemplo.test',
  subject: 'Turno confirmado',
  html: '<p>Hola</p>',
  text: 'Hola',
  attachments: [{ filename: 'turno.ics', content: 'QkVHSU4=' }],
};

const FROM = { name: 'Lisandro López', address: 'turnos@ejemplo.test' };

const failing = (error: unknown): { sendMail: () => Promise<never> } => ({ sendMail: async () => Promise.reject(error) });

describe('createGmailSender', () => {
  it('manda el email por el transporte con el remitente y el adjunto en base64', async () => {
    const sendMail = vi.fn(async () => ({}));
    await expect(createGmailSender({ from: FROM, transport: { sendMail } })(MESSAGE)).resolves.toBe(true);
    expect(sendMail).toHaveBeenCalledWith({
      from: FROM,
      to: 'paciente@ejemplo.test',
      subject: 'Turno confirmado',
      html: '<p>Hola</p>',
      text: 'Hola',
      attachments: [{ filename: 'turno.ics', content: 'QkVHSU4=', encoding: 'base64' }],
    });
  });

  it('sin adjuntos manda la lista vacía', async () => {
    const sendMail = vi.fn(async () => ({}));
    await createGmailSender({ from: FROM, transport: { sendMail } })({ ...MESSAGE, attachments: undefined });
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ attachments: [] }));
  });

  it.each([
    { error: Object.assign(new Error('paciente@ejemplo.test'), { code: 'EAUTH' }), reason: 'EAUTH' },
    { error: new TypeError('paciente@ejemplo.test'), reason: 'TypeError' },
    { error: 'texto', reason: 'desconocido' },
  ])('si Gmail falla devuelve false y loguea sólo $reason', async ({ error, reason }) => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await expect(createGmailSender({ from: FROM, transport: failing(error) })(MESSAGE)).resolves.toBe(false);
    expect(log).toHaveBeenCalledWith('No se pudo mandar un email:', { reason });
    expect(JSON.stringify(log.mock.calls)).not.toContain('paciente@ejemplo.test');
  });
});

describe('emailSenderFromEnv', () => {
  it.each([{}, { GMAIL_USER: 'turnos@ejemplo.test' }, { GMAIL_APP_PASSWORD: 'clave' }])('sin las dos credenciales no manda nada (%o)', async (env) => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await expect(emailSenderFromEnv(env)(MESSAGE)).resolves.toBe(false);
    expect(log).toHaveBeenCalledWith('No se pudo mandar un email:', { reason: 'faltan GMAIL_USER o GMAIL_APP_PASSWORD' });
  });

  it('con las credenciales arma un remitente de Gmail', () => {
    expect(emailSenderFromEnv({ GMAIL_USER: 'turnos@ejemplo.test', GMAIL_APP_PASSWORD: 'clave' })).toBeTypeOf('function');
  });
});
