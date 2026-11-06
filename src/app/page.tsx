import type { ReactElement } from 'react';
import { About } from '@/components/home/about';
import { FloatingBookingButton } from '@/components/home/floating-booking-button';
import { Hero } from '@/components/home/hero';

export default function Home(): ReactElement {
  return (
    <main className='flex flex-1 flex-col'>
      <Hero />
      <About />
      <div aria-hidden='true' data-testid='espacio-boton-flotante' className='h-28 bg-muted md:h-36' />
      <FloatingBookingButton />
    </main>
  );
}
