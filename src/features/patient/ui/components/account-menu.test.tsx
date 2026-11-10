import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AccountMenu } from './account-menu';

vi.mock('../../actions/logout-patient', () => ({ logoutPatient: vi.fn() }));

const open = (): HTMLElement => {
  const button = screen.getByRole('button', { name: 'Mi cuenta' });
  fireEvent.click(button);
  return button;
};

describe('AccountMenu', () => {
  it('cerrado por defecto y se abre y cierra con el botón', () => {
    render(<AccountMenu viewer={null} />);
    const button = screen.getByRole('button', { name: 'Mi cuenta' });
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('Mi espacio')).toBeNull();
    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('sin sesión ofrece iniciar sesión y registrarse', () => {
    render(<AccountMenu viewer={null} />);
    open();
    expect(screen.getByRole('link', { name: /Iniciar sesión/ }).getAttribute('href')).toBe('/login');
    expect(screen.getByRole('link', { name: 'Registrate' }).getAttribute('href')).toBe('/registro');
  });

  it('con sesión de paciente saluda, lleva a Mi espacio y cierra sesión', () => {
    render(<AccountMenu viewer={{ role: 'patient', name: 'Ana' }} />);
    open();
    expect(screen.getByText('Hola, Ana')).toBeDefined();
    expect(screen.getByRole('link', { name: /Ir a mi espacio/ }).getAttribute('href')).toBe('/mi-espacio');
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeDefined();
  });

  it('con sesión de admin lleva al panel', () => {
    render(<AccountMenu viewer={{ role: 'admin' }} />);
    open();
    expect(screen.getByText('Hola, Lisandro')).toBeDefined();
    expect(screen.getByRole('link', { name: /Ir al panel/ }).getAttribute('href')).toBe('/admin');
  });

  it('Escape lo cierra y devuelve el foco al botón', () => {
    render(<AccountMenu viewer={null} />);
    const button = open();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });

  it('un toque afuera lo cierra', () => {
    render(<AccountMenu viewer={null} />);
    const button = open();
    fireEvent.pointerDown(document.body);
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('si el foco sale de la tarjeta con Tab, se cierra', () => {
    render(<AccountMenu viewer={null} />);
    const button = open();
    fireEvent.focusIn(document.body);
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });
});
