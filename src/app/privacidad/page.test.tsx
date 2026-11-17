import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PrivacyPage from './page';

describe('/privacidad (US-20)', () => {
  it('muestra los temas de la política con su título', () => {
    render(<PrivacyPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Política de privacidad' })).toBeTruthy();
    for (const topic of ['Quién es el responsable', 'Qué datos pedimos', 'Para qué los usamos', 'Quién los ve', 'Tus derechos']) {
      expect(screen.getByRole('heading', { level: 2, name: topic })).toBeTruthy();
    }
  });

  it('nombra los derechos de acceso, rectificación y supresión y el contacto', () => {
    render(<PrivacyPage />);
    expect(screen.getByText(/pedir acceso a tus datos, corregirlos o que los eliminemos/)).toBeTruthy();
    expect(screen.getByText(/escribinos a lisandroiglopez@gmail\.com\./)).toBeTruthy();
  });

  it('US-50: nombra al responsable y los 3 proveedores, sin datos por completar ni fecha de actualización', () => {
    const { container } = render(<PrivacyPage />);
    expect(screen.getByText('Lisandro López, Licenciado en Nutrición.')).toBeTruthy();
    expect(screen.getByText(/utiliza 3 proveedores: uno que guarda la base de datos, otro que envía los emails, y uno que aloja la web/)).toBeTruthy();
    expect(screen.getByText('Cuidamos tus datos personales según la Ley 25.326 de Protección de los Datos Personales.')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Cuánto tiempo los guardamos' })).toBeNull();
    expect(container.textContent).not.toMatch(/Completar|Última actualización/);
  });
});
