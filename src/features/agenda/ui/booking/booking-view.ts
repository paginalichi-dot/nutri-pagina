import { longDay } from '@/lib/argentina-time';
import { argentinaTime } from '@/lib/format-date-time';
import type { BookingSelection } from './booking-selection';
import type { ReviewRow } from './booking-summary';
import type { SummaryCardProps, SummaryRow } from './booking-summary-card';

const NOTE = 'Podés reprogramar o cancelar tu turno hasta 24 hs antes.';

const placeRow = ({ modality, location }: BookingSelection): SummaryRow =>
  modality === 'virtual' ? { icon: 'video', label: 'Modalidad', value: 'Por videollamada' } : { icon: 'place', label: 'Lugar', value: location?.name ?? null };

export function summaryProps(selection: BookingSelection, { basePath, note = NOTE }: { basePath: string; note?: string }): SummaryCardProps {
  const { modality, choices, time, steps, step } = selection;
  const rows: SummaryRow[] = [
    placeRow(selection),
    { icon: 'day', label: 'Día', value: choices.dia ? longDay(choices.dia) : null },
    { icon: 'time', label: 'Horario', value: time ? `${argentinaTime(time)} hs` : null },
  ];
  const title = `Tu turno · ${modality === 'virtual' ? 'Virtual' : 'Presencial'}`;
  return { title, changeHref: basePath, rows, progress: { step: steps.indexOf(step) + 1, total: steps.length }, note };
}

export function placeText({ modality, location }: BookingSelection): string {
  if (modality === 'virtual' || !location) return 'Por videollamada';
  return [location.name, location.address].filter(Boolean).join(' · ');
}

export function reviewRows(selection: BookingSelection, time: Date): ReviewRow[] {
  return [
    { icon: selection.modality === 'virtual' ? 'video' : 'place', label: 'Lugar', value: placeText(selection) },
    { icon: 'day', label: 'Día', value: longDay(selection.choices.dia) },
    { icon: 'time', label: 'Horario', value: `${argentinaTime(time)} hs` },
  ];
}
