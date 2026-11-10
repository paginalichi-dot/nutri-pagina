'use client';

import Link from 'next/link';
import { type ReactElement, useEffect, useRef } from 'react';
import { PUBLIC_PRIMARY } from '@/components/form/public-form-parts';

export function AuthDone({ message }: { message: string }): ReactElement {
  const status = useRef<HTMLParagraphElement>(null);
  useEffect(() => status.current?.focus(), []);
  return (
    <div className='flex flex-col gap-5'>
      <p ref={status} role='status' tabIndex={-1} className='rounded-input bg-confirmed px-5 py-3 text-[15px] font-medium text-primary-foreground outline-none'>
        {message}
      </p>
      <Link href='/login' className={PUBLIC_PRIMARY}>
        Ingresar
      </Link>
    </div>
  );
}
