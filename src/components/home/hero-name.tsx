import type { ReactElement } from 'react';

export function HeroName(): ReactElement {
  return (
    <h1
      id='hero-title'
      data-hero-name
      data-intro
      className='relative z-0 text-center text-[15.5vw] leading-[0.95] font-extrabold uppercase lg:text-(length:--name-size) lg:leading-[0.88]'
    >
      <span data-hero-word className='block text-background lg:inline'>
        Lisandro
      </span>{' '}
      <span
        data-hero-word
        className='block text-transparent [-webkit-text-stroke:1.5px_var(--primary)] lg:inline lg:[-webkit-text-stroke:2.5px_var(--primary)]'
      >
        López
      </span>
    </h1>
  );
}
