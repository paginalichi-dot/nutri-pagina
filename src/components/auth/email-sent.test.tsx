import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmailSent } from './email-sent';

describe('EmailSent', () => {
  it('muestra «¡Ya casi está!», el texto, la indicación y vuelve al login, con el foco en el título', async () => {
    render(<EmailSent message='Te enviamos un correo.' hint='Revisá tu bandeja.' />);
    const title = screen.getByRole('heading', { name: '¡Ya casi está!' });
    expect(screen.getByText('Te enviamos un correo.')).toBeDefined();
    expect(screen.getByText('Revisá tu bandeja.')).toBeDefined();
    expect(screen.getByRole('link', { name: /Volver a iniciar sesión/ }).getAttribute('href')).toBe('/login');
    await waitFor(() => expect(document.activeElement).toBe(title));
  });
});
