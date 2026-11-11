import type { ReactElement } from 'react';
import { AboutHighlights } from './about-highlights';
import { AboutPhoto } from './about-photo';
import { HandUnderline } from './about-strokes';
import { ScrollHint } from './scroll-hint';

export const ABOUT_PARAGRAPHS = [
  'Entiendo la nutrición como una herramienta fundamental para cuidar la salud y mejorar la calidad de vida. Mi objetivo es acompañar a cada persona en su proceso, brindando una atención profesional, cercana y personalizada.',
  'A través de consultas nutricionales, planes adaptados a las necesidades individuales y un seguimiento continuo, busco ayudar a construir hábitos alimentarios saludables y sostenibles en el tiempo.',
  'Creo que cada persona tiene necesidades, objetivos y circunstancias diferentes. Por eso, considero fundamental escuchar, comprender y trabajar en conjunto para encontrar un camino que se adapte a cada estilo de vida.',
  'Mi compromiso es acompañarte en cada etapa de ese proceso, con atención, dedicación y profesionalismo.',
] as const;

export function About(): ReactElement {
  return (
    <section id='sobre-mi' aria-labelledby='sobre-mi-titulo' className='relative z-10 flex min-h-svh flex-col justify-center rounded-t-hero-mobile bg-muted px-4 py-16 md:rounded-t-hero md:px-20 md:pt-[min(108px,10svh)] md:pb-28 short:pt-6 short:pb-24'>
      <div className='mx-auto grid w-full max-w-[1280px] items-center gap-12 md:grid-cols-12 md:gap-x-10'>
        <div data-about-frame className='hidden md:col-span-5 md:block'>
          <AboutPhoto />
        </div>
        <div className='flex flex-col gap-8 md:col-span-7 short:gap-3'>
          <h2 id='sobre-mi-titulo' data-about-title className='text-[13px] leading-none font-bold tracking-[1px] uppercase'>
            Sobre mí
          </h2>
          <p data-about-lead className='text-[28px] leading-[1.3] font-medium text-balance md:text-[24px] lg:text-[32px] xl:text-[38.4px] short:text-[22px]'>
            Soy Lisandro López, <strong className='font-bold'>Licenciado en Nutrición</strong> por la{' '}
            <span className='whitespace-nowrap'>
              <strong className='relative inline-block font-bold'>
                Universidad Favaloro
                <HandUnderline />
              </strong>
              .
            </span>
          </p>
          <div data-about-body className='flex flex-col gap-5 text-base leading-[1.6] xl:block xl:columns-2 xl:gap-10 short:text-[14px] short:leading-normal'>
            {ABOUT_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph} className='break-inside-avoid xl:mb-5 short:mb-2'>
                {paragraph}
              </p>
            ))}
          </div>
          <AboutHighlights />
        </div>
      </div>
      <ScrollHint tone='onLight' />
    </section>
  );
}
