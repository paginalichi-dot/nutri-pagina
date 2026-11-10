import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { emailSenderFromEnv } from './send-email';

const MESSAGE = { to: 'ana@ejemplo.test', subject: 'Activá tu cuenta', html: '<p>Hola</p>', text: 'Hola' };

describe('outbox de archivos (E2E)', () => {
  it('con EMAIL_OUTBOX_DIR cada email queda como un JSON en esa carpeta', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'outbox-'));
    await expect(emailSenderFromEnv({ EMAIL_OUTBOX_DIR: directory, RESEND_API_KEY: 're_x' })(MESSAGE)).resolves.toBe(true);
    const [file = ''] = await readdir(directory);
    expect(JSON.parse(await readFile(join(directory, file), 'utf8'))).toEqual(MESSAGE);
    await rm(directory, { recursive: true });
  });

  it('en producción se niega a escribir emails en disco', () => {
    expect(() => emailSenderFromEnv({ EMAIL_OUTBOX_DIR: 'x', APP_ENV: 'production' })).toThrow('EMAIL_OUTBOX_DIR no se puede usar en producción.');
  });
});
