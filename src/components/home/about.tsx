import type { ReactElement } from 'react';

export const ABOUT_PARAGRAPHS = [
  'Soy Lisandro López, Licenciado en Nutrición por la Universidad Favaloro.',
  'Entiendo la nutrición como una herramienta fundamental para cuidar la salud y mejorar la calidad de vida. Mi objetivo es acompañar a cada persona en su proceso, brindando una atención profesional, cercana y personalizada.',
  'A través de consultas nutricionales, planes adaptados a las necesidades individuales y un seguimiento continuo, busco ayudar a construir hábitos alimentarios saludables y sostenibles en el tiempo.',
  'Creo que cada persona tiene necesidades, objetivos y circunstancias diferentes. Por eso, considero fundamental escuchar, comprender y trabajar en conjunto para encontrar un camino que se adapte a cada estilo de vida.',
  'Mi compromiso es acompañarte en cada etapa de ese proceso, con atención, dedicación y profesionalismo.',
] as const;

function PhotoPlaceholder(): ReactElement {
  return (
    <div className='flex aspect-[4/3] w-full items-center justify-center rounded-card border-2 border-dashed border-border bg-secondary p-6 text-center text-muted-foreground md:aspect-[4/5]'>
      [Completar: foto Sobre mí]
    </div>
  );
}

export function About(): ReactElement {
  const [lead, ...body] = ABOUT_PARAGRAPHS;
  return (
    <section
      id='sobre-mi'
      aria-labelledby='sobre-mi-titulo'
      className='mt-16 rounded-t-hero-mobile bg-muted px-4 py-16 md:mt-[108px] md:rounded-t-hero md:px-20 md:py-[108px]'
    >
      <div className='mx-auto grid max-w-[1280px] items-start gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16'>
        <PhotoPlaceholder />
        <div className='flex max-w-[34rem] flex-col gap-5'>
          <h2 id='sobre-mi-titulo' className='text-[28px] leading-[1.5] font-medium md:text-[38.4px]'>
            Sobre <strong className='font-bold underline decoration-primary decoration-4 underline-offset-8'>mí</strong>
          </h2>
          <p className='text-lg leading-[1.6] font-medium md:text-[21.6px]'>{lead}</p>
          {body.map((paragraph) => (
            <p key={paragraph} className='text-base leading-[1.6] md:text-[17px]'>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
