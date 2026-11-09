import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { Emphasis } from '@/components/notice-page';
import { PRIVACY_SECTIONS } from './sections';

export const metadata: Metadata = {
  title: 'Política de privacidad · Lisandro López',
  description: 'Cómo cuidamos tus datos personales según la Ley 25.326.',
};

export default function PrivacyPage(): ReactElement {
  return (
    <main className='flex flex-1 justify-center bg-muted px-4 py-16 md:px-8'>
      <article className='flex w-full max-w-3xl flex-col gap-8 rounded-card bg-background p-6 md:p-12'>
        <h1 className='text-[28px] leading-snug font-medium md:text-[38.4px]'>
          Política de <Emphasis>privacidad</Emphasis>
        </h1>
        <p className='max-w-[70ch] text-[16px] text-muted-foreground'>
          Cuidamos tus datos personales según la Ley 25.326 de Protección de los Datos Personales. Última actualización: 8 de noviembre de 2026.
        </p>
        {PRIVACY_SECTIONS.map(({ title, body }) => (
          <section key={title} className='flex max-w-[70ch] flex-col gap-3'>
            <h2 className='text-[20px] font-semibold'>{title}</h2>
            {body.map((paragraph) => (
              <p key={paragraph} className='text-[16px] leading-relaxed'>
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>
    </main>
  );
}
