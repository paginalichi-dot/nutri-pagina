import Link from 'next/link';
import type { ReactElement } from 'react';
import { PUBLIC_LINK } from '@/components/form/public-form-parts';

type Props = { text: string; href: string; label: string };

export function AuthFooter({ text, href, label }: Props): ReactElement {
  return (
    <p className='text-center text-[15px] font-medium text-muted-foreground'>
      {text}{' '}
      <Link href={href} className={`${PUBLIC_LINK} text-foreground`}>
        {label}
      </Link>
    </p>
  );
}
