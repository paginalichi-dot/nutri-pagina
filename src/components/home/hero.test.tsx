import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from './hero';

const text = (value: string | null): string => (value ?? '').replace(/\s+/g, ' ').trim();

describe('Hero', () => {
  it('el h1 es el nombre de Lisandro, con «López» en contorno', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(text(heading.textContent)).toBe('Lisandro López');
    expect(heading.lastElementChild?.className).toMatch(/text-transparent/);
  });

  it('no lleva la píldora de credencial ni la matrícula (decisión del dev)', () => {
    render(<Hero />);
    expect(screen.queryByText('Licenciado en Nutrición')).toBeNull();
    expect(screen.queryByText(/MN/)).toBeNull();
  });

  it('muestra las dos partes de la frase del cliente, textuales y en orden', () => {
    const { container } = render(<Hero />);
    const phrases = [...container.querySelectorAll('[data-hero-phrase]')].map((paragraph) => text(paragraph.textContent));
    expect(phrases).toEqual([
      'La alimentación nos atraviesa durante toda nuestra vida',
      'Y aprender a transformarla en un buen hábito es la base de tu salud',
    ]);
  });

  it('la foto describe a Lisandro', () => {
    render(<Hero />);
    expect(screen.getByRole('img').getAttribute('alt')).toMatch(/^Lisandro López, licenciado en nutrición/);
  });
});
