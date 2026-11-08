import { MapPin, Video } from 'lucide-react';
import type { ReactElement } from 'react';
import { minutesToTime, WEEKDAY_NAMES } from '@/lib/argentina-time';
import type { PublicLocation } from '../../domain/public-location.schema';

function hoursByDay(hours: PublicLocation['hours']): [string, string][] {
  return WEEKDAY_NAMES.flatMap((name, index) => {
    const ranges = hours.filter(({ weekday }) => weekday === index + 1).map(({ startMinute, endMinute }) => `${minutesToTime(startMinute)} a ${minutesToTime(endMinute)}`);
    const row: [string, string] = [name, ranges.join(' y ')];
    return ranges.length > 0 ? [row] : [];
  });
}

function Directions({ location }: { location: PublicLocation }): ReactElement {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address ?? '')}`;
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='flex h-12 items-center self-start rounded-full bg-background px-6 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground'
    >
      Cómo llegar
    </a>
  );
}

export function LocationCard({ location }: { location: PublicLocation }): ReactElement {
  const online = location.kind === 'ONLINE';
  const Icon = online ? Video : MapPin;
  return (
    <article className='flex flex-col gap-5 rounded-card bg-secondary p-6 md:p-8'>
      {location.mapUrl ? (
        <iframe src={location.mapUrl} title={`Mapa de ${location.name}`} loading='lazy' referrerPolicy='no-referrer-when-downgrade' className='aspect-[4/3] w-full rounded-[22px] border-0' />
      ) : null}
      <div className='flex flex-col gap-2'>
        <h3 className='flex items-center gap-2 text-[19px] font-medium md:text-[20px]'>
          <Icon aria-hidden='true' className='size-5 shrink-0' strokeWidth={2} />
          {location.name}
        </h3>
        <p className='text-muted-foreground'>{online ? 'Atención online, por videollamada.' : location.address}</p>
        {location.directions ? <p className='text-[15px] text-muted-foreground'>{location.directions}</p> : null}
      </div>
      <table className='w-full text-[15px]'>
        <caption className='sr-only'>Días y horarios de {location.name}</caption>
        <tbody>
          {hoursByDay(location.hours).map(([day, ranges]) => (
            <tr key={day} className='border-b border-border last:border-b-0'>
              <th scope='row' className='py-2 pr-4 text-left font-semibold capitalize'>
                {day}
              </th>
              <td className='py-2 text-right'>{ranges}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {online || !location.address ? null : <Directions location={location} />}
    </article>
  );
}
