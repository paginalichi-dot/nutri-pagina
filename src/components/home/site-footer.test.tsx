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

  it('muestra WhatsApp, Instagram y email con su texto al costado', () => {
    render(<SiteFooter year={2026} />);
    const hrefs = ['WhatsApp', 'Instagram', 'Email'].map((label) => {
      const link = screen.getByRole('link', { name: new RegExp(`^${label}: `) });
      expect(link.textContent?.trim()).not.toBe('');
      return link.getAttribute('href');
    });
    expect(hrefs).toEqual([expect.stringMatching(/^https:\/\/wa\.me\//), expect.stringMatching(/instagram\.com/), expect.stringMatching(/^mailto:/)]);
  });

  it('dice sólo «Nutrición», sin kinesiología', () => {
    const { container } = render(<SiteFooter year={2026} />);
    expect(screen.getByText('© 2026 Lisandro López · Nutrición')).toBeTruthy();
    expect(container.textContent).not.toMatch(/kinesiolog/i);
  });
});
