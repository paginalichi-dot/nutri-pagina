import type { ReactElement, ReactNode } from 'react';
import { ErrorMessage } from '@/components/form/form-parts';
import { longDay } from '@/lib/argentina-time';
import { LocationChoice, SlotGrid } from './booking-choices';
import { bookingHref, hiddenFor, STEP_LABELS, stepHref } from './booking-model';
import type { BookingSelection } from './booking-selection';
import { BookingSteps } from './booking-steps';
import { DayChoice } from './day-choice';
import { StepForm } from './step-form';

export type ConfirmSlot = { time: Date; back: string };
type FlowProps = { basePath: string; selection: BookingSelection; confirm: (slot: ConfirmSlot) => ReactNode };

function Empty({ children }: { children: ReactNode }): ReactElement {
  return <p className='text-[17px] text-muted-foreground'>{children}</p>;
}

function stepBody({ basePath, selection }: FlowProps, back: string | null): ReactNode {
  const { step, choices, places, days, month, slots, error } = selection;
  const form = { action: basePath, hidden: hiddenFor(choices, step), back };
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (step === 'ubicacion') {
    if (places.length === 0) return <Empty>Por ahora no hay consultorios para reservar online.</Empty>;
    return (
      <StepForm {...form} title='¿Dónde querés atenderte?'>
        <LocationChoice places={places} selected={choices.ubicacion} />
      </StepForm>
    );
  }
  if (step === 'dia') {
    if (days.length === 0) return <Empty>No hay horarios libres en los próximos 60 días. Probá más adelante.</Empty>;
    const monthHref = (mes: string): string => bookingHref(basePath, { ...form.hidden, mes, paso: 'dia' });
    return (
      <StepForm {...form} title='¿Qué día te queda bien?'>
        <DayChoice days={days} selected={choices.dia} month={month} monthHref={monthHref} />
      </StepForm>
    );
  }
  return (
    <StepForm {...form} title='Elegí un horario' lead={longDay(choices.dia)}>
      {slots.some(({ free }) => free) ? <SlotGrid slots={slots} selected={choices.hora} /> : <Empty>Ese día ya no quedan horarios. Volvé y elegí otro.</Empty>}
    </StepForm>
  );
}

export function BookingFlow(props: FlowProps): ReactElement {
  const { basePath, selection, confirm } = props;
  const { steps, step, choices, time } = selection;
  const index = steps.indexOf(step);
  const previous = steps[index - 1];
  const back = previous ? stepHref(basePath, { choices, step: previous }) : null;
  const pills = steps.map((id) => ({ label: STEP_LABELS[id], href: stepHref(basePath, { choices, step: id }) }));
  return (
    <div className='group/flow flex flex-col gap-8'>
      <BookingSteps steps={pills} current={index + 1} />
      <div key={step} data-enter='left' className='[--enter-duration:500ms]'>
        {step === 'confirmar' && time ? confirm({ time, back: back ?? basePath }) : stepBody(props, back)}
      </div>
    </div>
  );
}
