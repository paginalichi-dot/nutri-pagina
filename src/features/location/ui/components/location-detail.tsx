import { ExternalLink } from 'lucide-react';
import type { ReactElement } from 'react';
import type { LocationStats } from '../../domain/new-location.schema';
import type { LocationWithHours } from '../../domain/public-location.schema';
import { ActiveToggle, LocationMenu } from './location-detail-parts';
import { HoursTable } from './hours-table';
import { KindChip } from './location-list';

const EXTERNAL = 'inline-flex items-center gap-1 self-end text-[13px] font-semibold underline underline-offset-4';

function Place({ location }: { location: LocationWithHours }): ReactElement {
  if (location.kind === 'ONLINE') {
    return (
      <div className='flex flex-col gap-1 rounded-panel bg-secondary p-4'>
        <span className='text-[13px] font-semibold tracking-[1px] text-muted-foreground uppercase'>Link de la videollamada</span>
        <a href={location.videoUrl ?? '#'} target='_blank' rel='noopener noreferrer' className='truncate font-medium underline underline-offset-4'>
          {location.videoUrl}
        </a>
      </div>
    );
  }
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address ?? '')}`;
  return (
    <div className='flex flex-col gap-2'>
      {location.mapUrl ? <iframe src={location.mapUrl} title={`Mapa de ${location.name}`} loading='lazy' referrerPolicy='no-referrer-when-downgrade' className='aspect-[16/7] w-full rounded-panel border-0 bg-secondary' /> : null}
      <p className='text-muted-foreground'>
        {location.address}
        {location.directions ? ` · ${location.directions}` : ''}
      </p>
      <a href={maps} target='_blank' rel='noopener noreferrer' className={EXTERNAL}>
        Abrir en Google Maps
        <ExternalLink aria-hidden='true' className='size-4' strokeWidth={2} />
      </a>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }): ReactElement {
  return (
    <div className='flex flex-col items-center gap-1 px-2 py-4 text-center'>
      <span className='text-[28px] leading-none font-bold'>{value}</span>
      <span className='text-[13px] text-muted-foreground'>{label}</span>
    </div>
  );
}

export function LocationDetail({ location, stats }: { location: LocationWithHours; stats: LocationStats }): ReactElement {
  return (
    <article aria-labelledby='ubicacion-elegida' className='flex flex-col gap-5 rounded-panel bg-background p-5 md:p-7'>
      <header className='flex items-center gap-3'>
        <h2 id='ubicacion-elegida' className='min-w-0 text-[22px] leading-tight font-bold break-words md:text-[24px]'>
          {location.name}
        </h2>
        <KindChip location={location} />
        <span className='ml-auto'>
          <LocationMenu id={location.id} />
        </span>
      </header>
      <Place location={location} />
      <section aria-labelledby='horarios' className='flex flex-col gap-2'>
        <h3 id='horarios' className='text-[13px] font-semibold tracking-[1px] text-muted-foreground uppercase'>
          Horarios de atención
        </h3>
        <HoursTable locationId={location.id} hours={location.hours} />
      </section>
      <div className='grid grid-cols-2 divide-x divide-border rounded-panel bg-secondary'>
        <Stat value={stats.appointmentsThisMonth} label={stats.appointmentsThisMonth === 1 ? 'turno este mes' : 'turnos este mes'} />
        <Stat value={stats.blocksThisMonth} label={stats.blocksThisMonth === 1 ? 'bloqueo este mes' : 'bloqueos este mes'} />
      </div>
      <ActiveToggle location={location} />
    </article>
  );
}
