import type { ReactElement } from 'react';
import { About } from '@/components/home/about';
import { FloatingBookingButton } from '@/components/home/floating-booking-button';
import { Hero } from '@/components/home/hero';
import { AboutMotion } from '@/components/motion/about-motion';
import { HeroMotion } from '@/components/motion/hero-motion';
import { IntroPreloader } from '@/components/motion/intro-preloader';
import { SmoothScroll } from '@/components/motion/smooth-scroll';
import { getPublicLocations } from '@/features/location/actions/location-queries';
import { LocationsSection } from '@/features/location/ui/components/locations-section';
import { getActiveHealthInsurances } from '@/features/settings/actions/settings-queries';

export default async function Home(): Promise<ReactElement> {
  const [locations, insurances] = await Promise.all([getPublicLocations(), getActiveHealthInsurances()]);
  return (
    <>
      <IntroPreloader />
      <main data-reveal-mask className='flex flex-1 flex-col'>
        <SmoothScroll />
        <FloatingBookingButton />
        <HeroMotion>
          <Hero />
        </HeroMotion>
        <AboutMotion>
          <About />
        </AboutMotion>
        <LocationsSection locations={locations} insurances={insurances} />
        <div aria-hidden='true' data-testid='espacio-boton-flotante' className={`h-28 md:h-36 ${locations.length > 0 ? 'bg-background' : 'bg-muted'}`} />
      </main>
    </>
  );
}
