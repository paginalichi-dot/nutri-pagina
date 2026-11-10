import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TokenForm } from './token-form';

describe('TokenForm', () => {
  it('al mostrarse no llama a la action y lleva el token oculto', () => {
    const action = vi.fn();
    const { container } = render(<TokenForm action={action} token='abc_123' idle='Activar mi cuenta' busy='Activando…' />);
    expect(container.querySelector<HTMLInputElement>('input[name="token"]')?.value).toBe('abc_123');
    expect(action).not.toHaveBeenCalled();
  });

  it('al confirmar manda el token y muestra el éxito con el link a ingresar', async () => {
    const action = vi.fn().mockResolvedValue({ success: true, message: 'Listo.' });
    render(<TokenForm action={action} token='abc_123' idle='Activar mi cuenta' busy='Activando…' />);
    fireEvent.click(screen.getByRole('button', { name: 'Activar mi cuenta' }));
    const status = await screen.findByRole('status');
    expect(status.textContent).toBe('Listo.');
    await waitFor(() => expect(document.activeElement).toBe(status));
    expect(action.mock.calls[0]?.[1].get('token')).toBe('abc_123');
    expect(screen.getByRole('link', { name: 'Ingresar' }).getAttribute('href')).toBe('/login');
  });

  it('muestra el error del link', async () => {
    const action = vi.fn().mockResolvedValue({ success: false, code: 'INVALID_TOKEN', error: 'El link no sirve.' });
    render(<TokenForm action={action} token='x' idle='Activar mi cuenta' busy='Activando…' />);
    fireEvent.click(screen.getByRole('button', { name: 'Activar mi cuenta' }));
    expect((await screen.findByRole('alert')).textContent).toBe('El link no sirve.');
  });
});
