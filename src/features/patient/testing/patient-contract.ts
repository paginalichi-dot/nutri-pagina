import { vi } from 'vitest';
import { sharedRateLimit } from '@/features/rate-limit/testing/rate-limit-repository.fake';
import type { EmailMessage, EmailSender } from '@/lib/email/send-email';

export const outbox: EmailMessage[] = [];

export const emailModule = {
  emailSenderFromEnv: (): EmailSender => async (message: EmailMessage) => {
    outbox.push(message);
    return true;
  },
};

export async function nextServerModule(importOriginal: () => Promise<Record<string, unknown>>): Promise<Record<string, unknown>> {
  return {
    ...(await importOriginal()),
    after: (task: () => Promise<void>) => {
      void task();
    },
  };
}

export function tokenFrom(message: EmailMessage | undefined): string {
  return /\/([\w-]{43})(?:\s|$)/.exec(message?.text ?? '')?.[1] ?? '';
}

export function formOf(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

export const flushEmails = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

export function resetOutbox(): void {
  outbox.length = 0;
  sharedRateLimit.counts.clear();
  vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
}
