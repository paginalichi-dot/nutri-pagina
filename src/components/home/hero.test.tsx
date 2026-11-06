import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from './hero';

const lines = (text: string | null): string => (text ?? '').replace(/\s+/g, ' ').trim();

describe('Hero', () => {
  it('el h1 es el nombre de Lisandro', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Lisandro López');
  });

  it('muestra las dos partes de la frase del cliente, textuales y en orden', () => {
    const { container } = render(<Hero />);
    const phrases = [...container.querySelectorAll('p')].map((paragraph) => lines(paragraph.textContent));
    expect(phrases.slice(0, 2)).toEqual([
      'La alimentación nos atraviesa durante toda nuestra vida',
      'Y aprender a transformarla en un buen hábito es la base de tu salud',
    ]);
  });

  it('respeta los cortes de línea del pedido', () => {
    const { container } = render(<Hero />);
    const opening = container.querySelector('p');
    expect([...(opening?.children ?? [])].map((line) => lines(line.textContent))).toEqual(['La alimentación', 'nos atraviesa', 'durante toda', 'nuestra vida']);
  });

  it('la foto describe a Lisandro', () => {
    render(<Hero />);
    expect(screen.getByRole('img').getAttribute('alt')).toMatch(/^Lisandro López, licenciado en nutrición/);
  });

  it('los garabatos son decorativos', () => {
    render(<Hero />);
    expect(screen.getByTestId('hero-scribbles').getAttribute('aria-hidden')).toBe('true');
  });

  it('debajo va la línea de presentación, sin matrícula por ahora', () => {
    render(<Hero />);
    expect(screen.getByText('Lisandro López · Licenciado en Nutrición')).toBeDefined();
  });
});
