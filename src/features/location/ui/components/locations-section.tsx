import type { ReactElement } from 'react';
import type { PublicLocation } from '../../domain/public-location.schema';
import { LocationCard } from './location-card';

type LocationsSectionProps = { locations: PublicLocation[]; insurances: { id: string; name: string }[] };

export function LocationsSection({ locations, insurances }: LocationsSectionProps): ReactElement | null {
  if (locations.length === 0) return null;
  return (
    <section
      id='sucursales'
      aria-labelledby='sucursales-titulo'
      className='relative z-20 flex min-h-svh flex-col justify-center rounded-t-hero-mobile bg-background px-4 py-16 md:rounded-t-hero md:px-20 md:py-[108px]'
    >
      <div className='mx-auto flex w-full max-w-[1280px] flex-col gap-10'>
        <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <h2 id='sucursales-titulo' className='text-[28px] leading-[1.3] font-medium md:text-[38.4px]'>
            Dónde <strong className='font-bold underline decoration-primary decoration-4 underline-offset-8'>atiendo</strong>
          </h2>
          <p className='max-w-md text-lg text-muted-foreground'>Elegí el consultorio que te quede cómodo, o atendete online desde tu casa.</p>
        </div>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]'>
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
        <div className='flex flex-col gap-3'>
          <h3 className='text-[17px] font-semibold'>Obras sociales</h3>
          <ul className='flex flex-wrap gap-2'>
            {[{ id: 'particular', name: 'Particular' }, ...insurances].map(({ id, name }) => (
              <li key={id} className='rounded-full border border-border bg-background px-4 py-2 text-[15px] font-medium'>
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
