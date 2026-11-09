import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { EmailSender } from './send-email';

export function createFileOutbox(directory: string): EmailSender {
  return async (message) => {
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, `${Date.now()}-${randomUUID()}.json`), JSON.stringify(message));
    return true;
  };
}
