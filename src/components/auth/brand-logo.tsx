import Image from 'next/image';
import type { ReactElement } from 'react';
import logo from '@/app/icon.png';

export function BrandLogo({ className = 'size-12', alt = 'Logo de Lisandro López' }: { className?: string; alt?: string }): ReactElement {
  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary ${className}`}>
      <Image src={logo} alt={alt} className='size-full object-cover' priority />
    </span>
  );
}
