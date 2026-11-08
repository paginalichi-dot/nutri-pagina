import { whenText } from '@/lib/argentina-time';

type NoticeParts = { done: string; emailSent: boolean | null; duplicateStartsAt?: Date | null };

const EMAIL_TEXT = {
  sent: 'Le mandamos un email al paciente.',
  failed: 'No pudimos mandar el email: avisale por WhatsApp.',
  missing: 'No tiene email: avisale por WhatsApp.',
} as const;

export function noticeMessage({ done, emailSent, duplicateStartsAt = null }: NoticeParts): string {
  const email = emailSent === null ? EMAIL_TEXT.missing : emailSent ? EMAIL_TEXT.sent : EMAIL_TEXT.failed;
  const duplicate = duplicateStartsAt ? ` Ojo: ese email ya tenía un turno el ${whenText(duplicateStartsAt)}.` : '';
  return `${done} ${email}${duplicate}`;
}
