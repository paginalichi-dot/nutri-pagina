import type { ReactElement } from 'react';
import { About } from '@/components/home/about';
import { FloatingBookingButton } from '@/components/home/floating-booking-button';
import { Hero } from '@/components/home/hero';

export default function Home(): ReactElement {
  return (
    <main className='flex flex-1 flex-col bg-muted pb-28 md:pb-36'>
      <Hero />
      <About />
      <FloatingBookingButton />
    </main>
  );
}
