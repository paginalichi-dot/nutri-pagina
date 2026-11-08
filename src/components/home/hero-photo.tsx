import Image from 'next/image';
import type { ReactElement } from 'react';

export function HeroPhoto(): ReactElement {
  return (
    <div
      data-hero-photo
      data-intro
      className='relative z-10 -mt-[8vw] w-full max-w-[460px] lg:absolute lg:bottom-0 lg:left-1/2 lg:mt-0 lg:h-[calc(100%-48px-var(--name-size)*0.5)] lg:w-auto lg:max-w-none lg:-translate-x-1/2'
    >
      <Image
        src='/foto-cabecera.png'
        alt='Lisandro López, licenciado en nutrición, sonriente y de brazos cruzados con su ambo beige'
        width={1086}
        height={1448}
        preload
        sizes='(min-width: 768px) 50vw, 92vw'
        className='h-auto w-full lg:h-full lg:w-auto'
      />
      <div className='pointer-events-none absolute inset-x-0 -bottom-px h-24 bg-(image:--gradient-forest) lg:hidden' />
    </div>
  );
}
