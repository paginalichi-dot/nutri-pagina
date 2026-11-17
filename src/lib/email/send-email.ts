import { createTransport } from 'nodemailer';
import { createFileOutbox } from './file-outbox';
export type EmailAttachment = { filename: string; content: string };

export type EmailMessage = { to: string; subject: string; html: string; text: string; attachments?: EmailAttachment[] };

export type EmailSender = (message: EmailMessage) => Promise<boolean>;

export type MailTransport = { sendMail(mail: object): Promise<unknown> };

type GmailConfig = { from: { name: string; address: string }; transport: MailTransport };

const DEFAULT_NAME = 'Lisandro López';

function logFailure(reason: string): void {
  console.error('No se pudo mandar un email:', { reason });
}

function failureReason(error: unknown): string {
  if (!(error instanceof Error)) return 'desconocido';
  return 'code' in error && typeof error.code === 'string' ? error.code : error.name;
}

function gmailMail(from: GmailConfig['from'], message: EmailMessage): object {
  const { to, subject, html, text, attachments = [] } = message;
  const files = attachments.map(({ filename, content }) => ({ filename, content, encoding: 'base64' }));
  return { from, to, subject, html, text, attachments: files };
}

export function createGmailSender({ from, transport }: GmailConfig): EmailSender {
  return async (message) => {
    try {
      await transport.sendMail(gmailMail(from, message));
      return true;
    } catch (error) {
      logFailure(failureReason(error));
      return false;
    }
  };
}

export function emailSenderFromEnv(env: Readonly<Record<string, string | undefined>>): EmailSender {
  if (env.EMAIL_OUTBOX_DIR) {
    if (env.APP_ENV === 'production') throw new Error('EMAIL_OUTBOX_DIR no se puede usar en producción.');
    return createFileOutbox(env.EMAIL_OUTBOX_DIR);
  }
  const { GMAIL_USER: user, GMAIL_APP_PASSWORD: pass } = env;
  if (!user || !pass) {
    return async () => {
      logFailure('faltan GMAIL_USER o GMAIL_APP_PASSWORD');
      return false;
    };
  }
  const transport = createTransport({ service: 'gmail', auth: { user, pass } });
  return createGmailSender({ from: { name: env.EMAIL_FROM || DEFAULT_NAME, address: user }, transport });
}
