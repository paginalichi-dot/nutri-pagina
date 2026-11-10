'use client';

import { Plus, X } from 'lucide-react';
import { useRef } from 'react';
import type { ReactElement } from 'react';
import { FOCUS, INPUT } from '@/components/form/form-parts';
import { WEEKDAY_NAMES } from '@/lib/argentina-time';
import { ICON_BUTTON } from './hours-row';
import { Switch } from './step-card';
import { type DraftRange, type WeekDraft, withDay } from './week-draft';

type RangeProps = { weekday: number; day: string; range: DraftRange; onChange: (range: DraftRange) => void; onRemove: (() => void) | null };

function RangeInputs({ weekday, day, range, onChange, onRemove }: RangeProps): ReactElement {
  return (
    <div className='flex items-center gap-2'>
      <input type='hidden' name='weekday' value={weekday} />
      <input name='start' type='time' step={300} required aria-label={`Desde, ${day}`} value={range.start} onChange={(event) => onChange({ ...range, start: event.target.value })} className={`${INPUT} w-32`} />
      <span aria-hidden='true'>a</span>
      <input name='end' type='time' step={300} required aria-label={`Hasta, ${day}`} value={range.end} onChange={(event) => onChange({ ...range, end: event.target.value })} className={`${INPUT} w-32`} />
      {onRemove ? (
        <button type='button' aria-label={`Quitar la franja del ${day}`} onClick={onRemove} className={ICON_BUTTON}>
          <X aria-hidden='true' className='size-5' strokeWidth={2} />
        </button>
      ) : null}
    </div>
  );
}

export function WeekHoursEditor({ week, onChange }: { week: WeekDraft; onChange: (week: WeekDraft) => void }): ReactElement {
  const nextKey = useRef(1);
  const fresh = (start: string, end: string): DraftRange => ({ key: nextKey.current++, start, end });
  return (
    <ul aria-label='Horarios por día'>
      {WEEKDAY_NAMES.map((day, index) => {
        const ranges = week[index] ?? [];
        const set = (next: DraftRange[]): void => onChange(withDay(week, index, next));
        return (
          <li key={day} className='flex flex-wrap items-start gap-x-4 gap-y-2 border-b border-border py-3 last:border-b-0'>
            <Switch label={`Atendés los ${day.endsWith('s') ? day : `${day}s`}`} checked={ranges.length > 0} onChange={(event) => set(event.target.checked ? [fresh('09:00', '13:00')] : [])} />
            <span className='w-24 pt-2.5 font-semibold capitalize'>{day}</span>
            {ranges.length === 0 ? <span className='pt-2.5 text-[15px] text-muted-foreground'>No atendés</span> : null}
            {ranges.length > 0 ? (
              <div className='flex flex-col gap-2'>
                {ranges.map((range) => (
                  <RangeInputs key={range.key} weekday={index + 1} day={day} range={range} onChange={(changed) => set(ranges.map((item) => (item.key === range.key ? changed : item)))} onRemove={ranges.length > 1 ? () => set(ranges.filter((item) => item.key !== range.key)) : null} />
                ))}
                <button type='button' onClick={() => set([...ranges, fresh('16:00', '20:00')])} className={`flex h-11 items-center gap-2 self-start rounded-control text-[14px] font-semibold underline underline-offset-4 ${FOCUS}`}>
                  <Plus aria-hidden='true' className='size-4' strokeWidth={2.5} />
                  Franja
                </button>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
