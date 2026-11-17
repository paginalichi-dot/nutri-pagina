import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SiteFooter } from './site-footer';

describe('SiteFooter', () => {
  it('cierra la home con el logo, «¿Empezamos?» y la píldora hacia /reservar', () => {
    render(<SiteFooter year={2026} />);
    expect(screen.getByRole('img', { name: /Lisandro López/ })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('¿Empezamos?');
    expect(screen.getByRole('link', { name: 'Reservá tu turno' }).getAttribute('href')).toBe('/reservar');
  });

  it.each([
    { name: 'WhatsApp: +54 9 280 497-8101', href: 'https://wa.me/5492804978101' },
    { name: 'Instagram: @nutri.lopez', href: 'https://www.instagram.com/nutri.lopez/' },
    { name: 'Email: lisandroiglopez@gmail.com', href: 'mailto:lisandroiglopez@gmail.com' },
  ])('muestra los contactos reales de Lisandro con su texto al costado ($name)', ({ name, href }) => {
    render(<SiteFooter year={2026} />);
    const link = screen.getByRole('link', { name });
    expect(link.getAttribute('href')).toBe(href);
    expect(link.textContent).toBe(name.split(': ')[1]);
  });

  it('dice sólo «Nutrición», sin kinesiología', () => {
    const { container } = render(<SiteFooter year={2026} />);
    expect(screen.getByText('© 2026 Lisandro López · Nutrición')).toBeTruthy();
    expect(container.textContent).not.toMatch(/kinesiolog/i);
  });
});
