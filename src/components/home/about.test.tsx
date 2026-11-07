import { render, screen } from '@testing-library/react';
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

  it('mientras no llegue la foto, muestra el placeholder visible en el marco en arco', () => {
    render(<About />);
    expect(screen.getByText('[Completar: foto Sobre mí]').className).toMatch(/rounded-t-full/);
  });

  it('los trazos a mano son decorativos', () => {
    const { container } = render(<About />);
    const strokes = [...container.querySelectorAll('svg')];
    expect(strokes.length).toBeGreaterThan(0);
    expect(strokes.every((svg) => svg.getAttribute('aria-hidden') === 'true')).toBe(true);
  });
});
