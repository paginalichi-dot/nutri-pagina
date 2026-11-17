import type { ReactElement } from 'react';
import { AboutHighlights } from './about-highlights';
import { AboutPhoto } from './about-photo';
import { HandArrow, HandUnderline } from './about-strokes';
import { ScrollHint } from './scroll-hint';

export const ABOUT_TEXT =
  'Entiendo la nutrición como una herramienta para cuidar tu salud y tu calidad de vida. Te acompaño con una atención cercana y personalizada, un plan adaptado a tu estilo de vida y un seguimiento continuo, para construir juntos hábitos saludables que duren en el tiempo.';

export function About(): ReactElement {
  return (
    <section id='sobre-mi' aria-labelledby='sobre-mi-titulo' className='relative z-10 flex min-h-svh flex-col justify-center rounded-t-hero-mobile bg-muted px-4 py-16 md:rounded-t-hero md:px-20 md:pt-[min(108px,10svh)] md:pb-28 short:pt-6 short:pb-24'>
      <div className='mx-auto grid w-full max-w-[1280px] items-center gap-12 md:grid-cols-12 md:gap-x-10'>
        <div data-about-frame className='hidden md:col-span-5 md:block'>
          <AboutPhoto />
        </div>
        <div className='relative flex flex-col gap-8 md:col-span-7 short:gap-3'>
          <HandArrow />
          <h2 id='sobre-mi-titulo' data-about-title className='text-[28px] leading-[1.3] font-medium md:text-[38.4px] short:text-[28px]'>
            Sobre <strong className='relative inline-block font-bold'>mí<HandUnderline /></strong>
          </h2>
          <p data-about-lead className='text-[28px] leading-[1.3] font-medium text-balance md:text-[24px] lg:text-[32px] xl:text-[38.4px] short:text-[22px]'>
            Soy Lisandro López, <strong className='font-bold'>Licenciado en Nutrición</strong> por la <strong className='font-bold'>Universidad Favaloro</strong>.
          </p>
          <p data-about-body className='max-w-[55ch] text-base leading-[1.6] md:text-[17px] short:text-[15px] short:leading-normal'>
            {ABOUT_TEXT}
          </p>
          <AboutHighlights />
        </div>
      </div>
      <ScrollHint tone='onLight' />
    </section>
  );
}
