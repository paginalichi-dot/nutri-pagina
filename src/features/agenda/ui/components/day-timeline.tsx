import type { ReactElement } from 'react';
import { minutesToTime } from '@/lib/argentina-time';
import type { AgendaView, TimeRange } from '../../domain/appointment.schema';
import { AppointmentCard, BlockCard } from './appointment-card';
import { dayMinutes, HOUR_HEIGHT, hourSpan, onDay, placement } from './timeline-layout';

const FILL = { height: '100%' } as const;

export function DayTimeline({ day, view }: { day: string; view: AgendaView }): ReactElement {
  const appointments = view.appointments.filter(({ status }) => status !== 'CANCELLED').filter(onDay(day));
  const blocks = view.blocks.filter(onDay(day));
  const { first, last } = hourSpan([...appointments, ...blocks].map((item) => dayMinutes(day, item)));
  const hours = Array.from({ length: last - first + 1 }, (_, index) => first + index);
  const empty = appointments.length === 0 && blocks.length === 0;
  const at = (item: TimeRange): { top: number; height: number } => placement(dayMinutes(day, item), first);
  return (
    <div className='flex flex-col gap-3'>
      {empty ? <p className='text-[15px] text-muted-foreground'>No hay turnos este día.</p> : null}
      <div className={`relative my-2 ${empty ? 'hidden md:block' : ''}`} style={{ height: (last - first) * HOUR_HEIGHT }}>
        {hours.map((hour) => (
          <div key={hour} aria-hidden='true' className='absolute inset-x-0 flex items-center gap-3' style={{ top: (hour - first) * HOUR_HEIGHT }}>
            <span className='w-11 shrink-0 -translate-y-1/2 text-[12px] text-muted-foreground tabular-nums'>{minutesToTime(hour * 60)}</span>
            <span className='h-px flex-1 -translate-y-1/2 bg-border' />
          </div>
        ))}
        <ol aria-label='Turnos del día' className='absolute inset-y-0 right-0 left-14 border-l border-border'>
          {blocks.map((block) => (
            <li key={block.id} className='absolute inset-x-2' style={at(block)}>
              <BlockCard block={block} style={FILL} />
            </li>
          ))}
          {appointments.map((appointment) => (
            <li key={appointment.id} className='absolute inset-x-2 py-px' style={at(appointment)}>
              <AppointmentCard appointment={appointment} style={FILL} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
