import type { ReactElement } from 'react';
import { About } from '@/components/home/about';
import { FloatingBookingButton } from '@/components/home/floating-booking-button';
import { Hero } from '@/components/home/hero';
import { AboutMotion } from '@/components/motion/about-motion';
import { HeroMotion } from '@/components/motion/hero-motion';
import { IntroPreloader } from '@/components/motion/intro-preloader';
import { SmoothScroll } from '@/components/motion/smooth-scroll';

export default function Home(): ReactElement {
  return (
    <>
      <IntroPreloader />
      <main data-reveal-mask className='flex flex-1 flex-col'>
        <SmoothScroll />
        <HeroMotion>
          <Hero />
        </HeroMotion>
        <AboutMotion>
          <About />
        </AboutMotion>
        <div aria-hidden='true' data-testid='espacio-boton-flotante' className='h-28 bg-muted md:h-36' />
        <FloatingBookingButton />
      </main>
    </>
  );
}
