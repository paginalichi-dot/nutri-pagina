import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ABOUT_TEXT, About } from './about';

describe('Sobre mí', () => {
  it('tiene su título y el ancla para el nav', () => {
    const { container } = render(<About />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Sobre mí');
    expect(container.querySelector('section')?.id).toBe('sobre-mi');
  });

  it('US-49: el título grande «Sobre mí», la presentación y un solo párrafo', () => {
    const { container } = render(<About />);
    const paragraphs = [...container.querySelectorAll('p')].map((paragraph) => paragraph.textContent);
    expect(paragraphs).toEqual(['Soy Lisandro López, Licenciado en Nutrición por la Universidad Favaloro.', ABOUT_TEXT]);
    expect(screen.getByRole('heading', { level: 2 }).className).toMatch(/md:text-\[38\.4px\]/);
  });

  it('la foto de Lisandro ocupa su mitad desde 768px y no se muestra en el celular', () => {
    const { container } = render(<About />);
    const photo = screen.getByRole('img', { name: /Lisandro López/ });
    expect(photo.getAttribute('src')).toMatch(/foto-sobre-mi/);
    expect(container.querySelector('[data-about-frame]')?.className).toMatch(/^hidden .*md:block/);
    expect(screen.queryByText('[Completar: foto Sobre mí]')).toBeNull();
  });

  it('lleva el disco «Lic. en Nutrición» y los tres ítems', () => {
    render(<About />);
    expect(screen.getByText('Lic. en Nutrición')).toBeTruthy();
    const items = within(screen.getByRole('list')).getAllByRole('listitem').map((item) => item.textContent);
    expect(items).toEqual(['Universidad Favaloro', 'Atención personalizada', 'Seguimiento continuo']);
  });

  it('subraya «mí», suma la flecha y los trazos a mano son decorativos', () => {
    const { container } = render(<About />);
    expect(container.querySelector('[data-about-title] strong svg')).not.toBeNull();
    const strokes = [...container.querySelectorAll('svg')];
    expect(strokes.filter((svg) => svg.getAttribute('class')?.includes('text-scribble'))).not.toHaveLength(0);
    expect(strokes.every((svg) => svg.getAttribute('aria-hidden') === 'true')).toBe(true);
  });
});
