import Image from 'next/image';
import type { ReactElement, ReactNode } from 'react';
import { HeroScribbles } from './hero-scribbles';

function Mark({ children }: { children: ReactNode }): ReactElement {
  return <strong className='font-bold text-primary'>{children}</strong>;
}

const OPENING: ReactNode[] = [
  <>
    La <Mark>alimentación</Mark>
  </>,
  'nos atraviesa',
  'durante toda',
  'nuestra vida',
];

const CLOSING: ReactNode[] = ['Y aprender a', 'transformarla en', 'un buen hábito es', <Mark key='salud'>la base de tu salud</Mark>];

function Phrase({ lines, className }: { lines: ReactNode[]; className: string }): ReactElement {
  return (
    <p className={`relative z-20 text-lg leading-[1.6] font-medium text-muted md:absolute md:text-[21.6px] ${className}`}>
      {lines.map((line, index) => (
        <span key={index} className='block'>
          {line}{' '}
        </span>
      ))}
    </p>
  );
}

function Stage(): ReactElement {
  return (
    <div className='relative flex flex-1 flex-col items-center justify-end pt-8 md:static md:pt-0'>
      <h1
        id='hero-title'
        className='relative z-0 text-center text-[16vw] leading-[1.12] font-bold text-background uppercase md:absolute md:inset-x-0 md:top-[max(220px,28%)] md:text-[min(9vw,10rem)] md:leading-[0.9]'
      >
        <span className='block md:inline'>Lisandro </span>
        <span className='block md:inline'>López</span>
      </h1>
      <Image
        src='/foto-cabecera.png'
        alt='Lisandro López, licenciado en nutrición, sonriente y de brazos cruzados con su ambo beige'
        width={1086}
        height={1448}
        preload
        sizes='(min-width: 768px) 45vw, 80vw'
        className='relative z-10 -mt-[4vw] h-auto w-[80%] max-w-[420px] md:absolute md:bottom-0 md:left-1/2 md:mt-0 md:h-[calc(100%-max(220px,28%)-min(6vw,107px))] md:w-auto md:max-w-none md:-translate-x-1/2'
      />
      <div className='pointer-events-none absolute inset-x-0 -bottom-px z-10 h-20 bg-(image:--gradient-forest) md:hidden' />
    </div>
  );
}

export function Hero(): ReactElement {
  return (
    <section aria-labelledby='hero-title' className='bg-background p-4 pb-16 md:p-[35px] md:pb-[108px]'>
      <div className='relative isolate flex min-h-[calc(100svh-32px)] flex-col overflow-hidden rounded-hero-mobile bg-foreground px-6 pt-10 pb-10 md:h-[calc(100svh-70px)] md:min-h-[620px] md:rounded-hero md:p-0'>
        <Phrase lines={OPENING} className='md:top-14 md:left-16' />
        <Stage />
        <Phrase lines={CLOSING} className='mt-6 self-end text-right md:right-16 md:bottom-14 md:mt-0' />
        <HeroScribbles />
      </div>
      <p className='pt-6 text-center text-lg font-medium md:text-[21.6px]'>Lisandro López · Licenciado en Nutrición</p>
    </section>
  );
}
