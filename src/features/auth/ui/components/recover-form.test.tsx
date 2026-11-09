import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecoverForm } from './recover-form';

const requestPasswordReset = vi.hoisted(() => vi.fn());

vi.mock('@/features/patient/actions/request-password-reset', () => ({ requestPasswordReset }));
vi.mock('@/components/auth/brand-logo', () => ({ BrandLogo: () => null }));

describe('RecoverForm', () => {
  it('termina en «¡Ya casi está!» con el texto genérico, exista o no el email', async () => {
    requestPasswordReset.mockResolvedValue({ success: true, message: 'Listo.' });
    const { container } = render(<RecoverForm />);
    const form = container.querySelector('form');
    if (form) fireEvent.submit(form);
    expect(await screen.findByRole('heading', { name: '¡Ya casi está!' })).toBeDefined();
    expect(screen.getByText(/Si el email tiene una cuenta, te enviamos un correo/)).toBeDefined();
  });
});
