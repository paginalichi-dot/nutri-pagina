import { renderEmail } from '@/lib/email/render-email';
import type { EmailMessage } from '@/lib/email/send-email';

export type PatientEmailKind = 'verify' | 'registered' | 'reset' | 'change-email';

type Template = { subject: string; paragraphs: string[]; label: string };

const IGNORE = 'Si no fuiste vos, ignorá este email.';

const TEMPLATES: Readonly<Record<PatientEmailKind, Template>> = {
  verify: {
    subject: 'Activá tu cuenta',
    paragraphs: ['Gracias por registrarte. Para activar tu cuenta tocá el botón. El link vence en 24 horas.', IGNORE],
    label: 'Activar mi cuenta',
  },
  registered: {
    subject: 'Ya tenés una cuenta',
    paragraphs: ['Alguien intentó crear una cuenta con este email, pero ya tenés una.', 'Si te olvidaste la contraseña, elegí una nueva. El link vence en 1 hora.', IGNORE],
    label: 'Elegir una contraseña nueva',
  },
  reset: {
    subject: 'Elegí una contraseña nueva',
    paragraphs: ['Pediste cambiar tu contraseña. El link vence en 1 hora y sirve una sola vez.', 'Si no fuiste vos, ignorá este email: tu contraseña no cambia.'],
    label: 'Elegir una contraseña nueva',
  },
  'change-email': {
    subject: 'Confirmá tu email nuevo',
    paragraphs: ['Pediste usar este email en tu cuenta. Tocá el botón para confirmarlo. El link vence en 24 horas.', IGNORE],
    label: 'Confirmar mi email',
  },
};

const firstName = (name: string): string => name.trim().split(/\s+/)[0] ?? name;

export function patientEmail(kind: PatientEmailKind, { to, name, url }: { to: string; name: string; url: string }): EmailMessage {
  const { subject, paragraphs, label } = TEMPLATES[kind];
  return { to, subject, ...renderEmail({ title: subject, paragraphs: [`Hola ${firstName(name)}.`, ...paragraphs], action: { label, url } }) };
}
