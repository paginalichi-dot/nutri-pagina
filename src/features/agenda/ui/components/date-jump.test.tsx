import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DateJump, isJumpDay } from './date-jump';

describe('Ir a una fecha (US-45)', () => {
  it('CA-1: el form va a /admin con la vista actual y el día elegido', () => {
    render(<DateJump day='2026-11-10' mode='semana' />);
    const input = screen.getByLabelText<HTMLInputElement>('Ir a una fecha');
    const form = input.closest('form');
    expect(form?.getAttribute('action')).toBe('/admin');
    expect(input.name).toBe('dia');
    expect(input.value).toBe('2026-11-10');
    expect(form?.querySelector<HTMLInputElement>('input[name="vista"]')?.value).toBe('semana');
  });

  it('CA-1 y CA-2: una fecha completa se envía sola; una incompleta o del año 2 no', () => {
    render(<DateJump day='2026-11-10' mode='dia' />);
    const input = screen.getByLabelText<HTMLInputElement>('Ir a una fecha');
    const form = input.closest('form');
    const submit = vi.fn();
    if (form) form.requestSubmit = submit;
    fireEvent.change(input, { target: { value: '0002-11-10' } });
    expect(submit).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: '2026-12-24' } });
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['2026-12-24', true],
    ['2000-01-01', true],
    ['1999-12-31', false],
    ['0202-01-01', false],
    ['', false],
    ['2026-02-30', false],
  ])('CA-2: «%s» es una fecha para ir: %s', (value, expected) => {
    expect(isJumpDay(value)).toBe(expected);
  });
});
