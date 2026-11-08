import { MapPin, Video } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { minutesToTime, WEEKDAY_NAMES } from '@/lib/argentina-time';
import type { LocationWithHours } from '../../domain/public-location.schema';

function summary(location: LocationWithHours): string {
  if (location.hours.length === 0) return 'Sin horarios cargados';
  return location.hours.map(({ weekday, startMinute, endMinute }) => `${WEEKDAY_NAMES[weekday - 1]} ${minutesToTime(startMinute)}–${minutesToTime(endMinute)}`).join(' · ');
}

export function LocationList({ locations }: { locations: LocationWithHours[] }): ReactElement {
  if (locations.length === 0) {
    return <p className='rounded-panel bg-background p-6 text-muted-foreground'>Todavía no cargaste ninguna ubicación. Empezá por tu consultorio o por la atención online.</p>;
  }
  return (
    <ul className='flex flex-col gap-3'>
      {locations.map((location) => {
        const Icon = location.kind === 'ONLINE' ? Video : MapPin;
        return (
          <li key={location.id}>
            <Link
              href={`/admin/ubicaciones/${location.id}`}
              className='hover-shade flex items-start gap-4 rounded-panel bg-background p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground md:p-6'
            >
              <Icon aria-hidden='true' className='mt-1 size-5 shrink-0' strokeWidth={2} />
              <span className='flex flex-col gap-1'>
                <span className='text-[19px] font-medium'>
                  {location.name}
                  {location.active ? null : <span className='ml-3 rounded-full bg-secondary px-3 py-1 text-[13px] text-muted-foreground'>Desactivada</span>}
                </span>
                <span className='text-muted-foreground'>{location.kind === 'ONLINE' ? 'Online' : location.address}</span>
                <span className='text-[15px] text-muted-foreground'>{summary(location)}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
