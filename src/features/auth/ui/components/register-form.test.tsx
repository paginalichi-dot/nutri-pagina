import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RegisterForm } from './register-form';

vi.mock('@/features/patient/actions/register', () => ({ register: vi.fn() }));

describe('RegisterForm', () => {
  it('pide el consentimiento y linkea a la política de privacidad', () => {
    render(<RegisterForm />);
    expect(screen.getByRole<HTMLInputElement>('checkbox', { name: /Leí y acepto/ }).required).toBe(true);
    expect(screen.getByRole('link', { name: 'política de privacidad' }).getAttribute('href')).toBe('/privacidad');
  });

  it('tiene los campos del alta y el botón', () => {
    render(<RegisterForm />);
    ['Nombre y apellido', 'Email', 'Teléfono (WhatsApp)', 'Contraseña'].forEach((label) => expect(screen.getByLabelText(label)).toBeDefined());
    expect(screen.getByRole('button', { name: 'Crear mi cuenta' })).toBeDefined();
  });

  it('el lector de pantalla lee la pista de la contraseña', () => {
    render(<RegisterForm />);
    const hintId = screen.getByLabelText('Contraseña').getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(hintId)?.textContent).toBe('Al menos 8 caracteres.');
  });
});
