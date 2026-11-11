import Image from 'next/image';
import type { ReactElement } from 'react';

const ARCH = 'rounded-t-full rounded-b-card';

export function AboutPhoto(): ReactElement {
  return (
    <div className='relative mx-auto aspect-[4/5] w-[min(100%,calc((100svh-200px)*0.8))] max-w-[30rem]'>
      <div aria-hidden='true' className={`absolute inset-0 -translate-x-7 -translate-y-4 border-2 border-primary ${ARCH}`} />
      <div data-about-frame className={`relative size-full overflow-hidden ${ARCH}`}>
        <Image
          src='/foto-sobre-mi.jpg'
          alt='Lisandro López sonriente, con la toga de graduación, frente al logo de la Universidad Favaloro'
          fill
          sizes='(min-width: 1280px) 480px, 40vw'
          className='object-cover object-[60%_30%]'
        />
      </div>
      <span className='absolute -right-6 bottom-[6%] flex size-28 items-center justify-center rounded-full bg-primary p-4 text-center text-[15px] leading-tight font-semibold text-foreground shadow-halo short:size-24 short:text-sm'>
        Lic. en Nutrición
      </span>
    </div>
  );
}
