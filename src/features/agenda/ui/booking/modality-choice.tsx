import { ArrowLeft, Building2, LogOut, MonitorSmartphone } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS } from '@/components/form/form-parts';
import { logoutPatient } from '@/features/patient/actions/logout-patient';
import { bookingHref, type Modality } from './booking-model';
import { type ModalityOption, PanelContent } from './modality-panel';

const OPTIONS: readonly ModalityOption[] = [
  {
    modality: 'presencial',
    icon: Building2,
    title: 'Presencial',
    lead: 'En el consultorio, con evaluación y medición en persona.',
    chips: ['Antropometría', 'Plan a medida', 'Seguimiento'],
    cta: 'Elegir presencial',
  },
  {
    modality: 'virtual',
    icon: MonitorSmartphone,
    title: 'Virtual',
    lead: 'Por videollamada, desde donde estés y sin traslados.',
    chips: ['Desde tu casa', 'Enlace por mail', 'Mismo plan'],
    cta: 'Elegir virtual',
  },
];

const PANEL = 'group relative flex min-h-[50svh] flex-col justify-center overflow-hidden bg-background px-6 pt-24 pb-16 text-foreground sm:px-12 md:min-h-svh md:px-16 md:pt-28 lg:px-24';
const RING = 'focus-visible:outline-4 focus-visible:-outline-offset-8';
const BACK =
  'flex h-11 items-center gap-2 rounded-full pr-4 pl-3 text-[15px] font-semibold text-footer-text transition-colors duration-200 hover:bg-background/10 hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
const LOGOUT = `hover-shade hover-shade-on-dark flex h-11 items-center gap-2 rounded-full bg-background px-5 text-[15px] font-semibold text-foreground shadow-halo md:bg-foreground md:text-background ${FOCUS}`;

function Panel({ option, href }: { option: ModalityOption; href: string | null }): ReactElement {
  const dark = option.modality === 'presencial';
  const className = `${PANEL} ${dark ? 'theme-forest' : ''}`;
  const enter = dark ? 'unfold-left' : 'unfold-right';
  if (!href) {
    return (
      <div data-enter={enter} className={className}>
        <PanelContent option={option} available={false} />
      </div>
    );
  }
  return (
    <Link
      href={href}
      data-enter={enter}
      aria-label={option.cta}
      aria-describedby={`modalidad-${option.modality}`}
      className={`${className} ${RING} ${dark ? 'focus-visible:outline-primary' : 'focus-visible:outline-foreground'}`}
    >
      <span aria-hidden='true' className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${dark ? 'bg-foreground/5' : 'bg-primary/10'}`} />
      <PanelContent option={option} available />
    </Link>
  );
}

type ChoiceProps = { basePath: string; available: ReadonlySet<Modality>; back: { href: string; label: string } };

export function ModalityChoice({ basePath, available, back }: ChoiceProps): ReactElement {
  return (
    <main className='relative grid min-h-svh overflow-hidden bg-muted md:grid-cols-2'>
      <h1 className='sr-only'>Elegí cómo querés tu consulta</h1>
      {OPTIONS.map((option) => (
        <Panel key={option.modality} option={option} href={available.has(option.modality) ? bookingHref(basePath, { modalidad: option.modality }) : null} />
      ))}
      <div data-enter='unfold-left' className='absolute top-4 left-3 z-20 sm:left-9 md:top-6 md:left-13 lg:left-21'>
        <Link href={back.href} aria-label={back.label} className={BACK}>
          <ArrowLeft aria-hidden='true' className='size-5' />
          Volver
        </Link>
      </div>
      <form action={logoutPatient} className='absolute top-4 right-4 z-20 md:top-6 md:right-8'>
        <button type='submit' className={LOGOUT}>
          <LogOut aria-hidden='true' className='size-5' />
          Cerrar sesión
        </button>
      </form>
    </main>
  );
}
