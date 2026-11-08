import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { changeEmail } from '../../actions/change-email';
import { changePassword } from '../../actions/change-password';
import { ChangeEmailForm, ChangePasswordForm } from './account-forms';

vi.mock('../../actions/change-email', () => ({ changeEmail: vi.fn() }));
vi.mock('../../actions/change-password', () => ({ changePassword: vi.fn() }));

function fill(fields: Record<string, string>): void {
  Object.entries(fields).forEach(([label, value]) => fireEvent.change(screen.getByLabelText(label), { target: { value } }));
}

describe('formularios de Mi cuenta', () => {
  it('cambiar el email pide el email nuevo y la contraseña actual, y muestra el aviso de éxito', async () => {
    vi.mocked(changeEmail).mockResolvedValue({ success: true, message: 'Listo. Desde ahora entrás con nuevo@ejemplo.test.' });
    render(<ChangeEmailForm />);
    expect(screen.getByRole('form', { name: 'Cambiar el email' })).toBeDefined();
    fill({ 'Email nuevo': 'nuevo@ejemplo.test', 'Contraseña actual': 'actual' });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar email' }));
    expect((await screen.findByRole('status')).textContent).toBe('Listo. Desde ahora entrás con nuevo@ejemplo.test.');
    expect(vi.mocked(changeEmail).mock.calls[0]?.[1].get('currentPassword')).toBe('actual');
  });

  it('cambiar la contraseña muestra el error de la action', async () => {
    vi.mocked(changePassword).mockResolvedValue({ success: false, code: 'VALIDATION', error: 'Las contraseñas no coinciden.' });
    render(<ChangePasswordForm />);
    fill({ 'Contraseña actual': 'actual', 'Contraseña nueva': 'clave-nueva-1', 'Repetí la contraseña nueva': 'otra-clave-1' });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar contraseña' }));
    expect((await screen.findByRole('alert')).textContent).toBe('Las contraseñas no coinciden.');
    expect(screen.getByLabelText('Contraseña nueva').getAttribute('autocomplete')).toBe('new-password');
  });

  it('mientras guarda, el botón dice "Guardando…" y queda deshabilitado', async () => {
    vi.mocked(changePassword).mockReturnValue(new Promise(() => undefined));
    render(<ChangePasswordForm />);
    fill({ 'Contraseña actual': 'actual', 'Contraseña nueva': 'clave-nueva-1', 'Repetí la contraseña nueva': 'clave-nueva-1' });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar contraseña' }));
    expect((await screen.findByRole('button', { name: 'Guardando…' })).hasAttribute('disabled')).toBe(true);
  });
});
