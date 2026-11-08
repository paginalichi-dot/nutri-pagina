import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { login } from '../../actions/login';
import { LoginForm } from './login-form';

vi.mock('../../actions/login', () => ({ login: vi.fn() }));

function fillAndSubmit(): void {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@ejemplo.test' } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'una-clave' } });
  fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
}

describe('LoginForm', () => {
  it('tiene email y contraseña con sus labels y el autocompletado del navegador', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText('Email').getAttribute('autocomplete')).toBe('username');
    expect(screen.getByLabelText('Contraseña').getAttribute('type')).toBe('password');
  });

  it('el honeypot queda fuera del alcance del teclado y de los lectores de pantalla', () => {
    const { container } = render(<LoginForm />);
    const honeypot = container.querySelector('input[name="website"]');
    expect(honeypot?.getAttribute('tabindex')).toBe('-1');
    expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('envía los datos a la action y muestra su error', async () => {
    vi.mocked(login).mockResolvedValue({ success: false, code: 'INVALID_CREDENTIALS', error: 'El email o la contraseña no son correctos.' });
    render(<LoginForm />);
    fillAndSubmit();
    expect((await screen.findByRole('alert')).textContent).toBe('El email o la contraseña no son correctos.');
    const formData = vi.mocked(login).mock.calls[0]?.[1];
    expect(formData?.get('email')).toBe('admin@ejemplo.test');
    expect(formData?.get('website')).toBe('');
  });

  it('mientras envía, el botón dice "Entrando…" y queda deshabilitado', async () => {
    vi.mocked(login).mockReturnValue(new Promise(() => undefined));
    render(<LoginForm />);
    fillAndSubmit();
    const button = await screen.findByRole('button', { name: 'Entrando…' });
    expect(button.hasAttribute('disabled')).toBe(true);
  });
});
