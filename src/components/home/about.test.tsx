import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { About } from './about';

describe('Sobre mí', () => {
  it('tiene su título y el ancla para el nav', () => {
    const { container } = render(<About />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Sobre mí');
    expect(container.querySelector('section')?.id).toBe('sobre-mi');
  });

  it('muestra los cinco párrafos del cliente, textuales y en orden', () => {
    const { container } = render(<About />);
    const paragraphs = [...container.querySelectorAll('p')].map((paragraph) => paragraph.textContent);
    expect(paragraphs).toHaveLength(5);
    expect(paragraphs[0]).toBe('Soy Lisandro López, Licenciado en Nutrición por la Universidad Favaloro.');
    expect(paragraphs[1]).toMatch(/^Entiendo la nutrición como una herramienta fundamental/);
    expect(paragraphs[2]).toMatch(/^A través de consultas nutricionales/);
    expect(paragraphs[3]).toMatch(/^Creo que cada persona tiene necesidades/);
    expect(paragraphs[4]).toBe('Mi compromiso es acompañarte en cada etapa de ese proceso, con atención, dedicación y profesionalismo.');
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

  it('subraya «Universidad Favaloro» y los trazos a mano son decorativos', () => {
    const { container } = render(<About />);
    expect(container.querySelector('[data-about-lead] strong:last-of-type svg')).not.toBeNull();
    const strokes = [...container.querySelectorAll('svg')];
    expect(strokes.every((svg) => svg.getAttribute('aria-hidden') === 'true')).toBe(true);
  });
});
