import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS } from '@/components/form/form-parts';
import { addDays, longDay, minutesToTime, WEEKDAY_NAMES } from '@/lib/argentina-time';
import { argentinaTime } from '@/lib/format-date-time';
import { type AgendaView, type AppointmentRow, type AppointmentStatus, STATUS_LABELS } from '../../domain/appointment.schema';
import { agendaHref } from './agenda-toolbar';
import { HATCH } from './appointment-card';
import { bandOf, bandStarts, type DayMinutes, dayMinutes, onDay, touchesBand } from './timeline-layout';

const SQUARE_STYLE: Readonly<Record<AppointmentStatus, string>> = {
  PENDING: 'bg-muted border-foreground',
  CONFIRMED: 'bg-confirmed border-primary',
  ATTENDED: 'bg-confirmed border-primary',
  NO_SHOW: 'bg-secondary border-footer-text',
  CANCELLED: 'bg-secondary border-border',
};

const hour = (band: number): string => minutesToTime(band * 60).slice(0, 2);
const shortDay = (name: string, day: string): string => `${name.charAt(0).toUpperCase()}${name.slice(1, 3)} ${Number(day.slice(8))}`;

function Square({ appointment }: { appointment: AppointmentRow }): ReactElement {
  const time = argentinaTime(appointment.startsAt);
  return (
    <Link
      href={`/admin/turnos/${appointment.id}`}
      title={appointment.patientName}
      aria-label={`${time}, ${appointment.patientName}, ${STATUS_LABELS[appointment.status]}`}
      className={`hover-shade flex size-11 items-center justify-center rounded-control border text-[12px] font-semibold tabular-nums ${SQUARE_STYLE[appointment.status]} ${FOCUS}`}
    >
      {time}
    </Link>
  );
}

function BandCell({ blocked, appointments }: { blocked: boolean; appointments: AppointmentRow[] }): ReactElement {
  return (
    <td className={`h-14 border-l border-border p-1.5 align-top ${blocked ? HATCH : ''}`}>
      {blocked ? <span className='sr-only'>Bloqueado</span> : null}
      {appointments.length > 0 ? (
        <ul className='flex flex-wrap gap-1'>
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              <Square appointment={appointment} />
            </li>
          ))}
        </ul>
      ) : null}
    </td>
  );
}

type RowProps = { day: string; name: string; today: string; bands: readonly number[]; view: AgendaView };

function DayRow({ day, name, today, bands, view }: RowProps): ReactElement {
  const appointments = view.appointments.filter(({ status }) => status !== 'CANCELLED').filter(onDay(day));
  const blocks: DayMinutes[] = view.blocks.filter(onDay(day)).map((block) => dayMinutes(day, block));
  return (
    <tr className='border-t border-border'>
      <th scope='row' className='pr-2 text-left align-top'>
        <Link href={agendaHref(day, 'dia')} aria-label={`Ver el ${longDay(day)}`} className={`hover-shade flex min-h-11 items-center rounded-control px-1 text-[13px] ${day === today ? 'font-bold' : 'font-medium'} ${FOCUS}`}>
          {shortDay(name, day)}
        </Link>
      </th>
      {bands.map((band) => (
        <BandCell key={band} blocked={blocks.some((block) => touchesBand(block, band))} appointments={appointments.filter((appointment) => bandOf(dayMinutes(day, appointment).start) === band)} />
      ))}
    </tr>
  );
}

export function WeekGrid({ monday, today, view }: { monday: string; today: string; view: AgendaView }): ReactElement {
  const days = WEEKDAY_NAMES.map((name, index) => ({ name, day: addDays(monday, index) }));
  const items = [...view.appointments.filter(({ status }) => status !== 'CANCELLED'), ...view.blocks];
  const bands = bandStarts(days.flatMap(({ day }) => items.filter(onDay(day)).map((item) => dayMinutes(day, item))));
  return (
    <table className='my-2 w-full table-fixed border-collapse'>
      <caption className='sr-only'>Turnos de la semana por franjas de 4 horas</caption>
      <thead>
        <tr>
          <th scope='col' className='w-14'>
            <span className='sr-only'>Día</span>
          </th>
          {bands.map((band) => (
            <th key={band} scope='col' className='pb-2 pl-1.5 text-left text-[12px] font-medium text-muted-foreground tabular-nums'>
              {hour(band)}–{hour(band + 4)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {days.map(({ name, day }) => (
          <DayRow key={day} day={day} name={name} today={today} bands={bands} view={view} />
        ))}
      </tbody>
    </table>
  );
}
