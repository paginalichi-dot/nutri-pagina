import type { ReactElement, ReactNode } from 'react';
import { HeroName } from './hero-name';
import { HeroPhoto } from './hero-photo';
import { HeroPhraseClosing, HeroPhraseOpening } from './hero-phrase';

export function Hero({ account }: { account?: ReactNode }): ReactElement {
  return (
    <section aria-labelledby='hero-title' className='bg-background p-4 pb-16 lg:p-[35px] lg:pb-[108px]'>
      <div
        data-hero-frame
        className='@container relative isolate flex min-h-[calc(100svh-32px)] flex-col items-center overflow-hidden rounded-hero-mobile bg-foreground px-6 pt-[4.5rem] pb-10 [--name-size:min(8.4vw,8.5rem,15svh)] lg:[--phrase-w:calc(50cqw-96px-0.375*(max(100svh-70px,520px)-48px-var(--name-size)*0.5))] lg:h-[calc(100svh-70px)] lg:min-h-[520px] lg:rounded-hero lg:px-16 lg:pt-12 lg:pb-0'
      >
        {account ? (
          <div data-account data-intro className='absolute top-4 right-5 z-30 lg:top-12 lg:right-14'>
            {account}
          </div>
        ) : null}
        <HeroName />
        <HeroPhoto />
        <HeroPhraseOpening />
        <HeroPhraseClosing />
      </div>
    </section>
  );
}
