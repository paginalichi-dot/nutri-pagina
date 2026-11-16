import { type ReactElement, Suspense } from 'react';
import { About } from '@/components/home/about';
import { FloatingBookingButton } from '@/components/home/floating-booking-button';
import { Hero } from '@/components/home/hero';
import { SiteFooter } from '@/components/home/site-footer';
import { AboutMotion } from '@/components/motion/about-motion';
import { HeroMotion } from '@/components/motion/hero-motion';
import { IntroPreloader } from '@/components/motion/intro-preloader';
import { SmoothScroll } from '@/components/motion/smooth-scroll';
import { getPublicLocations } from '@/features/location/actions/location-queries';
import { LocationsSection } from '@/features/location/ui/components/locations-section';
import { getActiveHealthInsurances } from '@/features/settings/actions/settings-queries';
import { AccountMenu } from '@/features/patient/ui/components/account-menu';
import { AccountStatus } from '@/features/patient/ui/components/account-status';
import { currentYear } from '@/lib/current-year';

export default async function Home(): Promise<ReactElement> {
  const [locations, insurances, year] = await Promise.all([getPublicLocations(), getActiveHealthInsurances(), currentYear()]);
  return (
    <>
      <IntroPreloader />
      <main data-reveal-mask className='flex flex-1 flex-col'>
        <SmoothScroll />
        <FloatingBookingButton />
        <HeroMotion>
          <Hero
            account={
              <Suspense fallback={<AccountMenu viewer={null} />}>
                <AccountStatus />
              </Suspense>
            }
          />
        </HeroMotion>
        <AboutMotion>
          <About />
        </AboutMotion>
        <LocationsSection locations={locations} insurances={insurances} />
        <SiteFooter year={year} />
      </main>
    </>
  );
}
