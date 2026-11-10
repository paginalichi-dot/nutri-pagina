import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PanelNav } from './panel-nav';

const pathname = vi.hoisted(() => ({ value: '/admin' }));
vi.mock('next/navigation', () => ({ usePathname: () => pathname.value }));

describe('PanelNav', () => {
  it('T-4 y US-26 CA-1: muestra la marca, Agenda, Pacientes, Ubicaciones, Ajustes y Mi cuenta, con el pie que recibe', () => {
    render(<PanelNav footer={<button type='button'>Cerrar sesión</button>} />);
    const links = screen.getAllByRole('link');
    expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Agenda', '/admin'],
      ['Pacientes', '/admin/pacientes'],
      ['Ubicaciones', '/admin/ubicaciones'],
      ['Ajustes', '/admin/ajustes'],
      ['Mi cuenta', '/admin/cuenta'],
    ]);
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeDefined();
    expect(screen.getByText('NUTRICIONISTA')).toBeDefined();
  });

  it('US-39 CA-1: Agenda lleva el contador de solicitudes por confirmar; sin solicitudes, nada', () => {
    const { rerender } = render(<PanelNav footer={null} pending={3} />);
    expect(screen.getByRole('link', { name: /^Agenda/ }).textContent).toBe('Agenda3 solicitudes por confirmar');
    rerender(<PanelNav footer={null} pending={0} />);
    expect(screen.getByRole('link', { name: /^Agenda/ }).textContent).toBe('Agenda');
  });

  it('T-4 CA-2: marca sólo la sección actual con aria-current', () => {
    pathname.value = '/admin/ubicaciones/123';
    render(<PanelNav footer={null} />);
    expect(screen.getByRole('link', { name: 'Ubicaciones' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getAllByRole('link').filter((link) => link.hasAttribute('aria-current'))).toHaveLength(1);
  });

  it('T-4 CA-3: cada link tiene un área táctil de al menos 44px', () => {
    render(<PanelNav footer={null} />);
    for (const link of screen.getAllByRole('link')) expect(link.className).toContain('min-h-11 min-w-11');
  });
});
