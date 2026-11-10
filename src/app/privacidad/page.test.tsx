import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PrivacyPage from './page';

describe('/privacidad (US-20)', () => {
  it('muestra los temas de la política con su título', () => {
    render(<PrivacyPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Política de privacidad' })).toBeTruthy();
    for (const topic of ['Para qué los usamos', 'Qué datos pedimos', 'Cuánto tiempo los guardamos', 'Tus derechos']) {
      expect(screen.getByRole('heading', { level: 2, name: topic })).toBeTruthy();
    }
  });

  it('nombra los derechos de acceso, rectificación y supresión y el contacto', () => {
    render(<PrivacyPage />);
    expect(screen.getByText(/pedir acceso a tus datos, corregirlos o que los eliminemos/)).toBeTruthy();
    expect(screen.getByText(/escribinos a/)).toBeTruthy();
  });

  it('deja los datos que faltan como [Completar: …] visibles', () => {
    render(<PrivacyPage />);
    expect(screen.getByText('[Completar: plazo de guarda]')).toBeTruthy();
    expect(screen.getByText(/\[Completar: email de contacto\]/)).toBeTruthy();
    expect(screen.getByText(/\[Completar: nombre completo y domicilio del responsable\]/)).toBeTruthy();
  });
});
