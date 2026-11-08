import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { PublicLocation } from '../../domain/public-location.schema';
import { LocationsSection } from './locations-section';

const CENTRO: PublicLocation = {
  id: '7b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10',
  name: 'Consultorio Centro',
  kind: 'IN_PERSON',
  address: 'Calle Falsa 123',
  directions: 'Piso 2',
  mapUrl: 'https://www.google.com/maps/embed?pb=1',
  hours: [
    { weekday: 1, startMinute: 540, endMinute: 780 },
    { weekday: 1, startMinute: 960, endMinute: 1080 },
    { weekday: 3, startMinute: 540, endMinute: 600 },
  ],
};
const ONLINE: PublicLocation = { id: '8b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10', name: 'Online', kind: 'ONLINE', address: null, directions: null, mapUrl: null, hours: [] };

describe('LocationsSection', () => {
  it('US-19 CA-6: sin ubicaciones activas no se muestra', () => {
    const { container } = render(<LocationsSection locations={[]} insurances={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('US-19 CA-1: cada ubicación muestra su mapa, dirección, indicaciones y horarios por día', () => {
    render(<LocationsSection locations={[CENTRO, ONLINE]} insurances={[]} />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Dónde atiendo');
    expect(screen.getByTitle('Mapa de Consultorio Centro').getAttribute('loading')).toBe('lazy');
    const table = screen.getByRole('table', { name: 'Días y horarios de Consultorio Centro' });
    expect(within(table).getAllByRole('row').map((row) => row.textContent)).toEqual(['lunes09:00 a 13:00 y 16:00 a 18:00', 'miércoles09:00 a 10:00']);
    expect(screen.getByText('Piso 2')).toBeDefined();
    expect(screen.getByRole('link', { name: 'Cómo llegar' }).getAttribute('href')).toBe('https://www.google.com/maps/search/?api=1&query=Calle%20Falsa%20123');
  });

  it('US-19 CA-2: la ubicación online no tiene mapa, dirección ni «Cómo llegar»', () => {
    render(<LocationsSection locations={[ONLINE]} insurances={[]} />);
    expect(screen.getByText('Atención online, por videollamada.')).toBeDefined();
    expect(screen.queryByRole('link', { name: 'Cómo llegar' })).toBeNull();
    expect(screen.queryByTitle(/Mapa/)).toBeNull();
  });

  it('US-19 CA-3: las obras sociales van una sola vez, con Particular primero', () => {
    render(<LocationsSection locations={[CENTRO]} insurances={[{ id: 'a', name: 'Prepaga Uno' }]} />);
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Particular', 'Prepaga Uno']);
  });
});
