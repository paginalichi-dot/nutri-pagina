import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FloatingBookingButton } from './floating-booking-button';

describe('FloatingBookingButton', () => {
  it('es un link "Reservá tu turno" a /reservar, fijo abajo', () => {
    const { container } = render(<FloatingBookingButton />);
    expect(screen.getByRole('link', { name: 'Reservá tu turno' }).getAttribute('href')).toBe('/reservar');
    expect(container.firstElementChild?.className).toMatch(/\bfixed\b.*\bbottom-0\b/);
  });

  it('el calendario y la flecha son decorativos', () => {
    const { container } = render(<FloatingBookingButton />);
    const icons = [...container.querySelectorAll('svg')];
    expect(icons).toHaveLength(2);
    expect(icons.every((icon) => icon.getAttribute('aria-hidden') === 'true')).toBe(true);
  });
});
