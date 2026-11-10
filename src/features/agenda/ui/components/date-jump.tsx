'use client';

import { CalendarDays } from 'lucide-react';
import Form from 'next/form';
import type { ChangeEvent, MouseEvent, ReactElement } from 'react';
import { isArgentinaDay } from '@/lib/argentina-time';
import type { AgendaMode } from './agenda-toolbar';

const FIRST_YEAR = 2000;

export function isJumpDay(value: string): boolean {
  return isArgentinaDay(value) && Number(value.slice(0, 4)) >= FIRST_YEAR;
}

function openPicker(event: MouseEvent<HTMLInputElement>): void {
  if ('showPicker' in event.currentTarget) event.currentTarget.showPicker();
}

function jump(event: ChangeEvent<HTMLInputElement>): void {
  if (isJumpDay(event.currentTarget.value)) event.currentTarget.form?.requestSubmit();
}

export function DateJump({ day, mode }: { day: string; mode: AgendaMode }): ReactElement {
  return (
    <Form action='/admin' className='hover-shade relative flex size-11 shrink-0 items-center justify-center rounded-control border border-border bg-background has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-foreground'>
      <CalendarDays aria-hidden='true' className='size-5' strokeWidth={2} />
      <input type='date' name='dia' aria-label='Ir a una fecha' defaultValue={day} key={day} onClick={openPicker} onChange={jump} className='absolute inset-0 cursor-pointer opacity-0' />
      <input type='hidden' name='vista' value={mode} />
    </Form>
  );
}
