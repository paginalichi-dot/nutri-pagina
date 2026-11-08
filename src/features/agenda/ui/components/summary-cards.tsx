import { BarChart3, CalendarDays, Clock, type LucideIcon, Users } from 'lucide-react';
import type { ReactElement } from 'react';
import type { AgendaSummary } from '../../domain/appointment.schema';

const MINUS = '−';
const hoursFormat = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 });

export const formatHours = (minutes: number): string => hoursFormat.format(minutes / 60);

const signed = (value: number): string => (value > 0 ? `+${value}` : `${MINUS}${-value}`);

export function dayDelta(count: number, yesterday: number): string {
  return count === yesterday ? 'Igual que ayer' : `${signed(count - yesterday)} que ayer`;
}

export function weekDelta(count: number, previous: number): string {
  if (previous === 0) return count === 0 ? 'Igual que la semana anterior' : 'Sin turnos la semana anterior';
  const percent = Math.round(((count - previous) / previous) * 100);
  return percent === 0 ? 'Igual que la semana anterior' : `${signed(percent)}% vs. semana anterior`;
}

type Stat = { icon: LucideIcon; label: string; value: string; note: string };

function StatCard({ icon: Icon, label, value, note }: Stat): ReactElement {
  return (
    <li className='flex flex-col gap-3 rounded-panel bg-background p-4 md:flex-row md:gap-4 md:p-5'>
      <span className='hidden size-11 shrink-0 items-center justify-center rounded-full bg-primary/25 md:flex'>
        <Icon aria-hidden='true' className='size-5' strokeWidth={2} />
      </span>
      <div className='flex min-w-0 flex-col'>
        <p className='text-[14px] font-medium'>{label}</p>
        <p className='text-[28px] leading-tight font-bold tabular-nums'>{value}</p>
        <p className='text-[13px] text-muted-foreground'>{note}</p>
      </div>
    </li>
  );
}

function timeStat(time: AgendaSummary['time']): Stat {
  const base = { icon: Clock, label: 'Horas libres hoy' };
  if (!time) return { ...base, value: '—', note: 'Definí la duración en Ajustes' };
  if (time.availableMinutes === 0) return { ...base, value: '0', note: 'Hoy no atendés' };
  return { ...base, value: formatHours(time.freeMinutes), note: `De ${formatHours(time.availableMinutes)} disponibles` };
}

export function SummaryCards({ summary }: { summary: AgendaSummary }): ReactElement {
  const { today, week, newPatients, time } = summary;
  const stats: Stat[] = [
    { icon: CalendarDays, label: 'Turnos hoy', value: String(today.count), note: dayDelta(today.count, today.yesterday) },
    { icon: BarChart3, label: 'Esta semana', value: String(week.count), note: weekDelta(week.count, week.previous) },
    { icon: Users, label: 'Pacientes nuevos', value: String(newPatients), note: 'Esta semana' },
    timeStat(time),
  ];
  return (
    <ul aria-label='Resumen' className='grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4'>
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </ul>
  );
}
