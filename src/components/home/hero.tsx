import type { ReactElement } from 'react';
import { HeroName } from './hero-name';
import { HeroPhoto } from './hero-photo';
import { HeroPhraseClosing, HeroPhraseOpening } from './hero-phrase';

export function Hero(): ReactElement {
  return (
    <section aria-labelledby='hero-title' className='bg-background p-4 pb-16 lg:p-[35px] lg:pb-[108px]'>
      <div
        data-hero-frame
        className='relative isolate flex min-h-[calc(100svh-32px)] flex-col items-center overflow-hidden rounded-hero-mobile bg-foreground px-6 pt-12 pb-10 [--name-size:min(8.4vw,8.5rem)] lg:[--phrase-w:calc(50vw-131px-0.375*(max(100svh-70px,640px)-48px-var(--name-size)*0.5))] lg:h-[calc(100svh-70px)] lg:min-h-[640px] lg:rounded-hero lg:px-16 lg:pt-12 lg:pb-0'
      >
        <HeroName />
        <HeroPhoto />
        <HeroPhraseOpening />
        <HeroPhraseClosing />
      </div>
    </section>
  );
}
