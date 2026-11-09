import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DeleteAccountForm } from './delete-account-form';
import { EmailForm } from './email-form';
import { PasswordForm } from './password-form';
import { ProfileForm } from './profile-form';

vi.mock('../../actions/account-changes', () => ({
  updateProfile: vi.fn(),
  changePatientPassword: vi.fn(),
  requestEmailChange: vi.fn(),
  deleteAccount: vi.fn(),
}));

const profile = { id: 'p1', name: 'Ana Ficticia', email: 'ana@example.com', phone: '+5491100000000', version: 3 };

describe('formularios de Mi espacio', () => {
  it('datos: nombre, teléfono y versión oculta', () => {
    const { container } = render(<ProfileForm profile={profile} />);
    expect(screen.getByLabelText<HTMLInputElement>('Nombre').value).toBe('Ana Ficticia');
    expect(screen.getByLabelText<HTMLInputElement>('Teléfono (WhatsApp)').value).toBe('+5491100000000');
    expect(container.querySelector<HTMLInputElement>('input[name="version"]')?.value).toBe('3');
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeDefined();
  });

  it('email: muestra el actual, explica el link y pide la contraseña', () => {
    render(<EmailForm email='ana@example.com' />);
    expect(screen.getByText('ana@example.com')).toBeDefined();
    expect(screen.getByText(/el cambio se aplica cuando lo toques/)).toBeDefined();
    ['Email nuevo', 'Contraseña actual'].forEach((label) => expect(screen.getByLabelText(label)).toBeDefined());
  });

  it('contraseña: actual, nueva y repetición', () => {
    render(<PasswordForm />);
    ['Contraseña actual', 'Contraseña nueva', 'Repetí la contraseña nueva'].forEach((label) => expect(screen.getByLabelText(label)).toBeDefined());
  });

  it('baja: contraseña y casilla de confirmación obligatoria', () => {
    render(<DeleteAccountForm />);
    expect(screen.getByLabelText('Contraseña actual')).toBeDefined();
    expect(screen.getByRole<HTMLInputElement>('checkbox', { name: 'Sí, quiero eliminar mi cuenta' }).required).toBe(true);
    expect(screen.getByRole('button', { name: 'Eliminar mi cuenta' })).toBeDefined();
  });
});
