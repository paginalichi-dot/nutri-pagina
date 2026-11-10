import { ChevronRight, MapPin, Video } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS } from '@/components/form/form-parts';
import type { LocationRow } from '../../domain/location.schema';

export function KindChip({ location }: { location: Pick<LocationRow, 'kind' | 'active'> }): ReactElement {
  if (!location.active) return <span className='rounded-full bg-secondary px-3 py-1 text-[13px] font-medium text-muted-foreground'>Desactivada</span>;
  const online = location.kind === 'ONLINE';
  return <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${online ? 'bg-secondary' : 'bg-confirmed'}`}>{online ? 'Online' : 'Presencial'}</span>;
}

export function LocationThumb({ kind }: { kind: LocationRow['kind'] }): ReactElement {
  const Icon = kind === 'ONLINE' ? Video : MapPin;
  return (
    <span aria-hidden='true' className='flex size-14 shrink-0 items-center justify-center rounded-control bg-secondary'>
      <span className='flex size-8 items-center justify-center rounded-full bg-primary'>
        <Icon className='size-4' strokeWidth={2.25} />
      </span>
    </span>
  );
}

type ListProps = { locations: LocationRow[]; selectedId: string | null };

export function LocationList({ locations, selectedId }: ListProps): ReactElement {
  if (locations.length === 0) {
    return <p className='rounded-panel bg-background p-6 text-muted-foreground'>Todavía no cargaste ninguna ubicación. Empezá por tu consultorio o por la atención online.</p>;
  }
  return (
    <ul aria-label='Ubicaciones' className='flex flex-col overflow-hidden rounded-panel bg-background py-2'>
      {locations.map((location) => (
        <li key={location.id} className='border-b border-border px-2 last:border-b-0'>
          <Link
            href={`/admin/ubicaciones/${location.id}`}
            aria-current={location.id === selectedId ? 'page' : undefined}
            className={`hover-shade relative my-2 flex items-center gap-4 rounded-control p-3 before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-full aria-[current=page]:bg-primary/15 aria-[current=page]:before:bg-primary ${FOCUS}`}
          >
            <LocationThumb kind={location.kind} />
            <span className='flex min-w-0 flex-1 flex-col gap-1'>
              <span className='truncate text-[17px] font-semibold'>{location.name}</span>
              <span className='truncate text-[14px] text-muted-foreground'>{location.kind === 'ONLINE' ? 'Videollamada' : location.address}</span>
            </span>
            <KindChip location={location} />
            <ChevronRight aria-hidden='true' className='size-5 shrink-0 text-muted-foreground' strokeWidth={2} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
