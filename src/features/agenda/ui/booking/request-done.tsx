import { Check } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { PUBLIC_DARK, PUBLIC_LINK } from '@/components/form/public-form-parts';
import { cn } from '@/lib/utils';

type DoneProps = { title: string; lines: readonly string[]; again: { href: string; label: string } | null };

export function RequestDone({ title, lines, again }: DoneProps): ReactElement {
  return (
    <>
      <span aria-hidden='true' className='flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground ring-8 ring-primary/25'>
        <Check className='size-9' strokeWidth={2.5} />
      </span>
      <h2 className='mt-2 text-[28px] font-bold md:text-[34px]'>{title}</h2>
      {lines.map((line) => (
        <p key={line} className='max-w-md text-[16px] text-muted-foreground md:text-[17px]'>
          {line}
        </p>
      ))}
      <div className='mt-3 flex flex-col items-center gap-3 sm:flex-row sm:gap-6'>
        <Link href='/mi-espacio' className={cn(PUBLIC_DARK, 'w-auto px-8')}>
          Ver mis turnos
        </Link>
        {again ? (
          <Link href={again.href} className={`${PUBLIC_LINK} flex min-h-11 items-center`}>
            {again.label}
          </Link>
        ) : null}
      </div>
    </>
  );
}
