import type { ReactElement } from 'react';
import { addDays, longDay, WEEKDAY_NAMES } from '@/lib/argentina-time';
import { argentinaDay } from '@/lib/format-date-time';
import type { AgendaView, AppointmentRow, TimeRange } from '../../domain/appointment.schema';
import { AppointmentCard, BlockCard } from './appointment-card';

const onDay = (day: string) => (item: TimeRange) => argentinaDay(item.startsAt) === day || (argentinaDay(item.startsAt) < day && argentinaDay(item.endsAt) >= day);

function byLocation(appointments: AppointmentRow[]): [string, AppointmentRow[]][] {
  const groups = new Map<string, AppointmentRow[]>();
  for (const appointment of appointments) groups.set(appointment.locationName, [...(groups.get(appointment.locationName) ?? []), appointment]);
  return [...groups.entries()];
}

export function AgendaDay({ day, view }: { day: string; view: AgendaView }): ReactElement {
  const blocks = view.blocks.filter(onDay(day));
  const groups = byLocation(view.appointments.filter(onDay(day)));
  if (groups.length === 0 && blocks.length === 0) return <p className='rounded-panel bg-background p-6 text-muted-foreground'>No hay turnos este día.</p>;
  return (
    <div className='flex flex-col gap-4'>
      {blocks.map((block) => (
        <BlockCard key={block.id} block={block} />
      ))}
      <div className='grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]'>
        {groups.map(([location, appointments]) => (
          <section key={location} aria-label={location} className='flex flex-col gap-3 rounded-panel bg-background p-4'>
            <h2 className='text-[17px] font-semibold'>{location}</h2>
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

export function AgendaWeek({ monday, view }: { monday: string; view: AgendaView }): ReactElement {
  return (
    <div className='grid grid-cols-7 gap-2'>
      {WEEKDAY_NAMES.map((name, index) => {
        const day = addDays(monday, index);
        return (
          <section key={day} aria-label={longDay(day)} className='flex min-w-0 flex-col gap-2 rounded-panel bg-background p-2'>
            <h2 className='px-1 text-[13px] font-semibold capitalize'>
              {name} {Number(day.slice(8))}
            </h2>
            {view.blocks.filter(onDay(day)).map((block) => (
              <BlockCard key={block.id} block={block} />
            ))}
            {view.appointments.filter(onDay(day)).map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} showLocation />
            ))}
          </section>
        );
      })}
    </div>
  );
}
