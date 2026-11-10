import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SlotGrid } from './booking-choices';
import { BookingSteps } from './booking-steps';
import { DayChoice } from './day-choice';
import { StepForm } from './step-form';

vi.mock('next/form', () => ({ default: (props: Record<string, unknown>) => <form {...props} /> }));

const PILLS = [
  { label: 'Ubicación', href: '/reservar?paso=ubicacion' },
  { label: 'Día', href: '/reservar?paso=dia' },
  { label: 'Horario', href: '/reservar?paso=hora' },
  { label: 'Confirmar', href: '/reservar?paso=confirmar' },
];

describe('pasos de la reserva (US-40)', () => {
  it('CA-3: el paso actual va marcado y los anteriores son links para volver', () => {
    render(<BookingSteps steps={PILLS} current={3} />);
    const steps = within(screen.getByRole('list', { name: 'Pasos de la reserva' }));
    expect(steps.getAllByRole('link').map((link) => [link.getAttribute('aria-label'), link.getAttribute('href')])).toEqual([
      ['Paso 1: Ubicación (cambiar)', '/reservar?paso=ubicacion'],
      ['Paso 2: Día (cambiar)', '/reservar?paso=dia'],
    ]);
    expect(steps.getByText('Horario').closest('[aria-current]')?.getAttribute('aria-current')).toBe('step');
  });

  it('CA-3: cada paso es un form (next/form, GET sin recargar) con lo elegido antes, «Continuar» y «Atrás»', () => {
    render(
      <StepForm action='/reservar' title='¿Qué día te queda bien?' hidden={{ modalidad: 'presencial', ubicacion: 'centro' }} back='/reservar?paso=ubicacion'>
        <p>contenido</p>
      </StepForm>
    );
    const form = screen.getByRole('form', { name: '¿Qué día te queda bien?' });
    expect(form.getAttribute('action')).toBe('/reservar');
    expect([...form.querySelectorAll('input[type=hidden]')].map((input) => input.getAttribute('name'))).toEqual(['modalidad', 'ubicacion']);
    expect(screen.getByRole('button', { name: 'Continuar' }).getAttribute('type')).toBe('submit');
    expect(screen.getByRole('link', { name: 'Atrás' }).getAttribute('href')).toBe('/reservar?paso=ubicacion');
  });

  it('CA-5: el calendario muestra un mes, con flechas sólo hacia meses con días libres (L M X J V S D)', () => {
    render(<DayChoice days={['2026-11-30', '2026-12-01']} selected='2026-11-30' month='2026-11' monthHref={(mes) => `?mes=${mes}`} />);
    expect(screen.getByText('Noviembre 2026')).toBeDefined();
    expect(screen.getByText('X')).toBeDefined();
    expect(screen.getByRole('radio', { name: 'lunes, 30 de noviembre' })).toHaveProperty('checked', true);
    expect(screen.getAllByRole('radio')).toHaveLength(1);
    expect(screen.queryByRole('link', { name: 'Mes anterior' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Mes siguiente' }).getAttribute('href')).toBe('?mes=2026-12');
  });

  it('CA-5: los horarios ocupados se ven tachados y no se pueden elegir; la hora va en hora argentina', () => {
    const slots = [
      { startsAt: new Date('2026-11-10T12:00:00.000Z'), free: true },
      { startsAt: new Date('2026-11-10T12:45:00.000Z'), free: false },
    ];
    render(<SlotGrid slots={slots} selected='' />);
    expect(screen.getAllByRole('radio').map((radio) => radio.getAttribute('value'))).toEqual(['2026-11-10T12:00:00.000Z']);
    expect(screen.getByText('09:00')).toBeDefined();
    expect(screen.getByText('09:45').className).toContain('line-through');
    expect(screen.getByText('(ocupado)')).toBeDefined();
  });
});
