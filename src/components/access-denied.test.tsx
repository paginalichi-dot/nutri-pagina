import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AccessDenied } from './access-denied';

describe('pantalla de acceso denegado', () => {
  it('dice "Acceso denegado" y ofrece volver al inicio, sin ningún link al login', () => {
    render(<AccessDenied />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Acceso denegado');
    expect(screen.getByRole('link', { name: 'Volver al inicio' }).getAttribute('href')).toBe('/');
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });
});
