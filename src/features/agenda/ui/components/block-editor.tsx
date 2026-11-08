'use client';

import { useActionState } from 'react';
import type { ReactElement } from 'react';
import { ActionButton } from '@/components/form/action-button';
import { Field, FormFeedback, SubmitButton } from '@/components/form/form-parts';
import { longDay } from '@/lib/argentina-time';
import { argentinaDay, argentinaTime } from '@/lib/format-date-time';
import { createBlock, deleteBlock } from '../../actions/block-changes';
import type { BlockRow } from '../../domain/block.schema';

const when = (date: Date): string => `${longDay(argentinaDay(date))}, ${argentinaTime(date)}`;

export function BlockForm(): ReactElement {
  const [state, action, pending] = useActionState(createBlock, null);
  return (
    <form action={action} aria-label='Bloquear un horario' className='flex flex-col gap-5'>
      <div className='grid gap-4 sm:grid-cols-2'>
        <Field name='start' label='Desde' type='datetime-local' />
        <Field name='end' label='Hasta' type='datetime-local' />
      </div>
      <Field name='reason' label='Motivo (opcional, sólo lo ves vos)' required={false} hint='Por ejemplo: vacaciones, un trámite.' />
      <FormFeedback state={state} />
      <div className='self-start'>
        <SubmitButton pending={pending} idle='Bloquear' busy='Bloqueando…' />
      </div>
    </form>
  );
}

export function BlockList({ blocks }: { blocks: BlockRow[] }): ReactElement {
  if (blocks.length === 0) return <p className='text-muted-foreground'>No tenés bloqueos por venir.</p>;
  return (
    <ul aria-label='Bloqueos por venir'>
      {blocks.map((block) => (
        <li key={block.id} className='flex flex-col gap-3 border-b border-border py-4 last:border-b-0 sm:flex-row sm:items-start sm:justify-between'>
          <span className='flex flex-col gap-1'>
            <span className='font-medium first-letter:uppercase'>
              {when(block.startsAt)} a {when(block.endsAt)}
            </span>
            {block.reason ? <span className='text-muted-foreground'>{block.reason}</span> : null}
          </span>
          <ActionButton action={deleteBlock} fields={{ id: block.id, version: String(block.version) }} label='Borrar' busy='Borrando…' />
        </li>
      ))}
    </ul>
  );
}
