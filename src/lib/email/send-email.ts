import { createFileOutbox } from './file-outbox';
export type EmailAttachment = { filename: string; content: string };

export type EmailMessage = { to: string; subject: string; html: string; text: string; attachments?: EmailAttachment[] };

export type EmailSender = (message: EmailMessage) => Promise<boolean>;

type Fetcher = (url: string, init: RequestInit) => Promise<{ ok: boolean; status: number }>;

type ResendConfig = { apiKey: string; from: string; fetcher?: Fetcher };

const RESEND_URL = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'Lisandro López <onboarding@resend.dev>';

function logFailure(reason: string): void {
  console.error('No se pudo mandar un email:', { reason });
}

function resendBody(from: string, message: EmailMessage): string {
  const { to, subject, html, text, attachments } = message;
  return JSON.stringify({ from, to: [to], subject, html, text, attachments });
}

export function createResendSender({ apiKey, from, fetcher = fetch }: ResendConfig): EmailSender {
  return async (message) => {
    try {
      const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
      const response = await fetcher(RESEND_URL, { method: 'POST', headers, body: resendBody(from, message) });
      if (!response.ok) logFailure(`Resend respondió ${response.status}`);
      return response.ok;
    } catch (error) {
      logFailure(error instanceof Error ? error.name : 'desconocido');
      return false;
    }
  };
}

export function emailSenderFromEnv(env: Readonly<Record<string, string | undefined>>): EmailSender {
  if (env.EMAIL_OUTBOX_DIR) {
    if (env.APP_ENV === 'production') throw new Error('EMAIL_OUTBOX_DIR no se puede usar en producción.');
    return createFileOutbox(env.EMAIL_OUTBOX_DIR);
  }
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    return async () => {
      logFailure('falta RESEND_API_KEY');
      return false;
    };
  }
  return createResendSender({ apiKey, from: env.EMAIL_FROM || DEFAULT_FROM });
}
