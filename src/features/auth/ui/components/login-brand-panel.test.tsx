import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LoginBrandPanel } from './login-brand-panel';

vi.mock('@/components/auth/brand-logo', () => ({ BrandLogo: () => null }));

describe('LoginBrandPanel (US-34 CA-1)', () => {
  it('muestra el título «Tu salud, en foco.», la bajada y los dos íconos', () => {
    render(<LoginBrandPanel />);
    expect(screen.getByText(/Tu salud,/)).toBeTruthy();
    expect(screen.getByText('foco.')).toBeTruthy();
    expect(screen.getByText('Tus turnos de nutrición, en un solo lugar.')).toBeTruthy();
    expect(screen.getByText('Turnos')).toBeTruthy();
    expect(screen.getByText('Historial')).toBeTruthy();
  });

  it('se oculta debajo de 1024px y se muestra desde lg', () => {
    const { container } = render(<LoginBrandPanel />);
    const panel = container.firstElementChild;
    expect(panel?.classList.contains('hidden')).toBe(true);
    expect(panel?.classList.contains('lg:flex')).toBe(true);
  });
});
