'use client';

import { ArrowRight, Check, Clock, Mail } from 'lucide-react';
import Link from 'next/link';
import { type ReactElement, useEffect, useRef } from 'react';
import { FOCUS } from '@/components/form/form-parts';

const BACK = `hover-shade flex h-14 w-full max-w-[340px] items-center justify-center gap-2 rounded-full border border-foreground/40 bg-primary/15 px-6 text-[17px] font-semibold ${FOCUS}`;

function Illustration(): ReactElement {
  return (
    <div aria-hidden='true' className='relative flex h-32 w-56 items-center justify-center'>
      <span className='absolute inset-x-0 bottom-0 h-24 rounded-full bg-primary/20' />
      <span className='absolute top-2 left-10 h-1 w-5 rotate-[35deg] rounded-full bg-primary' />
      <span className='absolute top-0 left-16 h-5 w-1 -rotate-[30deg] rounded-full bg-primary' />
      <Mail className='relative size-20 text-foreground' strokeWidth={1.6} />
      <span className='absolute top-3 right-12 flex size-10 items-center justify-center rounded-full bg-primary'>
        <Check className='size-6 text-foreground' strokeWidth={3} />
      </span>
    </div>
  );
}

type Props = { message: string; hint: string };

export function EmailSent({ message, hint }: Props): ReactElement {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => title.current?.focus(), []);
  return (
    <div className='auth-glow w-full max-w-[560px]'>
      <span aria-hidden='true' className='absolute top-1/3 -right-10 -z-10 h-40 w-24 rotate-[25deg] rounded-[100%_0] bg-primary/25' />
      <span aria-hidden='true' className='absolute bottom-1/4 -left-10 -z-10 h-28 w-20 -rotate-[30deg] rounded-[100%_0] bg-primary/25' />
      <section className='flex flex-col items-center gap-6 rounded-card bg-background px-6 py-10 text-center shadow-halo md:px-12'>
        <Illustration />
        <h1 ref={title} tabIndex={-1} className='text-[34px] leading-tight font-bold outline-none md:text-[44px]'>
          ¡Ya casi está!
        </h1>
        <p className='max-w-[26ch] text-[19px] font-medium text-muted-foreground md:text-[22px]'>{message}</p>
        <p className='flex w-full items-center gap-4 rounded-input bg-primary/15 px-5 py-4 text-left text-[15px] font-medium'>
          <Clock aria-hidden='true' className='size-8 shrink-0' strokeWidth={1.8} />
          <span className='border-l border-foreground/30 pl-4'>{hint}</span>
        </p>
        <Link href='/login' className={BACK}>
          Volver a iniciar sesión
          <ArrowRight aria-hidden='true' className='size-5' />
        </Link>
      </section>
    </div>
  );
}
