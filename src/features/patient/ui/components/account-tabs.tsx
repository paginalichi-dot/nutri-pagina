'use client';

import { Lock, Mail, Trash2, UserRound } from 'lucide-react';
import { type KeyboardEvent, type ReactElement, useRef, useState } from 'react';
import { FOCUS } from '@/components/form/form-parts';
import type { PatientProfile } from '../../domain/patient.schema';
import { DeleteAccountForm } from './delete-account-form';
import { EmailForm } from './email-form';
import { PasswordForm } from './password-form';
import { ProfileForm } from './profile-form';

const TABS = [
  { id: 'datos', label: 'Tus datos', Icon: UserRound },
  { id: 'email', label: 'Tu email', Icon: Mail },
  { id: 'clave', label: 'Tu contraseña', Icon: Lock },
  { id: 'baja', label: 'Eliminar mi cuenta', Icon: Trash2 },
] as const;

type TabId = (typeof TABS)[number]['id'];

const tabClass = (active: boolean, id: TabId): string =>
  [
    `hover-shade flex min-h-11 shrink-0 items-center gap-3 rounded-input px-4 text-left text-[15px] font-semibold whitespace-nowrap ${FOCUS}`,
    active ? 'bg-primary/20 xl:shadow-[inset_3px_0_0_var(--primary)]' : '',
    id === 'baja' ? 'text-destructive xl:mt-auto' : '',
  ].join(' ');

function panelFor(id: TabId, profile: PatientProfile): ReactElement {
  if (id === 'datos') return <ProfileForm profile={profile} />;
  if (id === 'email') return <EmailForm email={profile.email} />;
  return id === 'clave' ? <PasswordForm /> : <DeleteAccountForm />;
}

export function AccountTabs({ profile }: { profile: PatientProfile }): ReactElement {
  const [active, setActive] = useState<TabId>('datos');
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const move = (event: KeyboardEvent, index: number): void => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (index + step + TABS.length) % TABS.length;
    setActive(TABS[next]?.id ?? 'datos');
    refs.current[next]?.focus();
  };
  return (
    <section aria-labelledby='account-title' className='flex min-w-0 flex-col gap-5 rounded-card bg-background p-6 md:p-8'>
      <h2 id='account-title' className='text-[22px] font-bold md:text-[24px]'>
        Mi cuenta
      </h2>
      <div className='flex min-w-0 flex-col gap-5 xl:flex-row xl:gap-6'>
        <div role='tablist' aria-label='Mi cuenta' className='-mx-2 flex gap-2 overflow-x-auto px-2 pb-1 xl:mx-0 xl:w-52 xl:shrink-0 xl:flex-col xl:overflow-visible xl:border-r xl:border-border xl:px-0 xl:pr-4'>
          {TABS.map(({ id, label, Icon }, index) => (
            <button key={id} ref={(node) => { refs.current[index] = node; }} type='button' role='tab' id={`tab-${id}`} aria-selected={active === id} aria-controls={`panel-${id}`} tabIndex={active === id ? 0 : -1} onClick={() => setActive(id)} onKeyDown={(event) => move(event, index)} className={tabClass(active === id, id)}>
              <Icon aria-hidden='true' className='size-5 shrink-0' />
              {label}
            </button>
          ))}
        </div>
        {TABS.map(({ id, label }) => (
          <section key={id} role='tabpanel' id={`panel-${id}`} aria-labelledby={`tab-${id}`} hidden={active !== id} className='flex min-w-0 flex-1 flex-col gap-4'>
            <h3 className='text-[18px] font-bold'>{label}</h3>
            {panelFor(id, profile)}
          </section>
        ))}
      </div>
    </section>
  );
}
