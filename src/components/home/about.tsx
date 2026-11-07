import type { ReactElement } from 'react';
import { HandArrow, HandUnderline } from './about-strokes';

export const ABOUT_PARAGRAPHS = [
  'Entiendo la nutrición como una herramienta fundamental para cuidar la salud y mejorar la calidad de vida. Mi objetivo es acompañar a cada persona en su proceso, brindando una atención profesional, cercana y personalizada.',
  'A través de consultas nutricionales, planes adaptados a las necesidades individuales y un seguimiento continuo, busco ayudar a construir hábitos alimentarios saludables y sostenibles en el tiempo.',
  'Creo que cada persona tiene necesidades, objetivos y circunstancias diferentes. Por eso, considero fundamental escuchar, comprender y trabajar en conjunto para encontrar un camino que se adapte a cada estilo de vida.',
  'Mi compromiso es acompañarte en cada etapa de ese proceso, con atención, dedicación y profesionalismo.',
] as const;

function ArchFrame(): ReactElement {
  return (
    <div
      data-about-frame
      className='flex aspect-[4/5] w-full max-w-[22rem] items-end justify-center rounded-t-full rounded-b-card border-2 border-dashed border-border bg-secondary p-8 pb-12 text-center text-muted-foreground md:max-w-none'
    >
      [Completar: foto Sobre mí]
    </div>
  );
}

export function About(): ReactElement {
  return (
    <section id='sobre-mi' aria-labelledby='sobre-mi-titulo' className='rounded-t-hero-mobile bg-muted px-4 py-16 md:rounded-t-hero md:px-20 md:py-[108px]'>
      <div className='mx-auto grid max-w-[1280px] items-start gap-12 md:grid-cols-12 md:gap-x-10'>
        <div className='md:col-span-5'>
          <ArchFrame />
        </div>
        <div className='relative flex flex-col gap-8 md:col-span-7 md:pt-6'>
          <HandArrow />
          <h2 id='sobre-mi-titulo' data-about-title className='text-[28px] leading-[1.3] font-medium md:text-[38.4px]'>
            Sobre <strong className='relative inline-block font-bold'>mí<HandUnderline /></strong>
          </h2>
          <p data-about-lead className='text-[28px] leading-[1.3] font-medium text-balance md:text-[38.4px]'>
            Soy Lisandro López, <strong className='font-bold'>Licenciado en Nutrición</strong> por la{' '}
            <strong className='font-bold'>Universidad Favaloro</strong>.
          </p>
          <div data-about-body className='flex flex-col gap-5 text-base leading-[1.6] md:block md:columns-2 md:gap-10 md:text-[17px]'>
            {ABOUT_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph} className='break-inside-avoid md:mb-5'>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
