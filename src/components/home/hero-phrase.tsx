import type { ReactElement, ReactNode } from 'react';
import { ClosingStrokes, OpeningStrokes } from './hero-strokes';
import { ScrollHint } from './scroll-hint';

function Mark({ children }: { children: ReactNode }): ReactElement {
  return <strong className='font-bold text-primary'>{children}</strong>;
}

const BASE =
  'relative z-20 max-w-[22rem] text-[clamp(1.25rem,5.2vw,1.875rem)] leading-[1.15] font-medium text-balance text-muted lg:absolute lg:text-pretty lg:bottom-[clamp(48px,8%,88px)] lg:w-(--phrase-w) lg:max-w-none lg:text-[calc(var(--phrase-w)/9.2)] lg:leading-[1.12]';

export function HeroPhraseOpening(): ReactElement {
  return (
    <p data-intro data-hero-phrase className={`${BASE} mt-8 self-start lg:mt-0 lg:left-16`}>
      La{' '}<Mark>alimentación</Mark> nos atraviesa durante toda nuestra vida
      <OpeningStrokes />
      <ScrollHint tone='onDark' placement='opening' />
    </p>
  );
}

export function HeroPhraseClosing(): ReactElement {
  return (
    <p data-intro data-hero-phrase className={`${BASE} mt-6 self-end text-right lg:mt-0 lg:right-16`}>
      Y aprender a transformarla en un buen hábito es <Mark>la base de tu{' '}salud</Mark>
      <ClosingStrokes />
      <ScrollHint tone='onDark' placement='phrase' />
    </p>
  );
}
