import 'server-only';
import { after } from 'next/server';
import { type EmailMessage, emailSenderFromEnv } from '@/lib/email/send-email';

export function sendLater(message: EmailMessage | null): void {
  if (!message) return;
  const send = emailSenderFromEnv(process.env);
  after(async () => {
    await send(message);
  });
}
