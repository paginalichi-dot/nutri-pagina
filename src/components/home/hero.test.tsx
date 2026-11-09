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

  it('las líneas a mano son decorativas, con trazos dibujables y las del cuerpo también en el celular', () => {
    const { container } = render(<Hero />);
    const strokes = [...container.querySelectorAll('svg[data-hero-strokes]')];
    expect(strokes.length).toBe(4);
    strokes.forEach((svg) => {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
      expect(svg.querySelectorAll('path[data-draw]').length).toBeGreaterThan(0);
    });
    const body = container.querySelector('[data-hero-photo] svg[data-hero-strokes]');
    expect(body?.getAttribute('class')).not.toMatch(/hidden/);
  });

  it('la flecha para bajar va junto a la frase de apertura en desktop y a la de cierre en el celular, y es decorativa', () => {
    const { container } = render(<Hero />);
    const [opening, closing] = container.querySelectorAll('[data-hero-phrase]');
    expect(opening?.querySelector('[data-scroll-hint]')?.getAttribute('class')).toMatch(/hidden lg:block/);
    expect(closing?.querySelector('[data-scroll-hint]')?.getAttribute('class')).toMatch(/lg:hidden/);
    for (const hint of container.querySelectorAll('[data-scroll-hint]')) expect(hint.getAttribute('aria-hidden')).toBe('true');
  });
});
