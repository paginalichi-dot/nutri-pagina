'use client';

import { type ReactElement, type ReactNode, useActionState, useEffect, useRef } from 'react';
import { ArrowDisc } from '@/components/arrow-disc';
import { ErrorMessage, FOCUS } from '@/components/form/form-parts';
import { PUBLIC_INPUT } from '@/components/form/public-form-parts';
import type { BookingResult } from '../../actions/patient-bookings';
import { STEP_TITLE, StepFooter } from './step-form';

const SUBMIT = `hover-shade hover-shade-on-dark flex h-12 items-center gap-3 rounded-full bg-foreground pr-1.5 pl-6 text-[16px] font-semibold text-background disabled:opacity-70 ${FOCUS}`;

type Insurance = { id: string; name: string };
type RequestFormProps = {
  action: (previous: BookingResult | null, formData: FormData) => Promise<BookingResult>;
  hidden: Readonly<Record<string, string>>;
  insurances?: readonly Insurance[];
  labels: { title: string; idle: string; busy: string };
  back: string;
  done: ReactNode;
  children: ReactNode;
};

function Done({ children }: { children: ReactNode }): ReactElement {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => box.current?.focus(), []);
  return (
    <div ref={box} role='status' tabIndex={-1} data-booking-done data-enter='left' className='flex flex-col items-center gap-4 py-10 text-center outline-none [--enter-duration:500ms] md:py-16'>
      {children}
    </div>
  );
}

function InsuranceSelect({ insurances }: { insurances: readonly Insurance[] }): ReactElement {
  return (
    <label className='flex max-w-md flex-col gap-2 text-[15px] font-semibold'>
      Obra social (opcional)
      <select name='healthInsuranceId' defaultValue='' className={PUBLIC_INPUT}>
        <option value=''>Particular</option>
        {insurances.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function RequestForm({ action, hidden, insurances, labels, back, done, children }: RequestFormProps): ReactElement {
  const [state, submit, pending] = useActionState(action, null);
  if (state?.success) return <Done>{done}</Done>;
  return (
    <form action={submit} aria-labelledby='paso-titulo' className='flex flex-col gap-6'>
      <h2 id='paso-titulo' className={STEP_TITLE}>
        {labels.title}
      </h2>
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type='hidden' name={name} value={value} />
      ))}
      {children}
      {insurances ? <InsuranceSelect insurances={insurances} /> : null}
      {state && !state.success ? <ErrorMessage>{state.error}</ErrorMessage> : null}
      <StepFooter back={back}>
        <button type='submit' disabled={pending} className={SUBMIT}>
          {pending ? labels.busy : labels.idle}
          <ArrowDisc className='size-9 bg-primary text-primary-foreground' />
        </button>
      </StepFooter>
    </form>
  );
}
