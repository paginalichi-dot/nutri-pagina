import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LocationForm } from './location-form';

vi.mock('../../actions/save-location', () => ({ saveLocation: vi.fn() }));

const ONLINE = { id: '7b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10', name: 'Online', kind: 'ONLINE', address: null, directions: null, mapUrl: null, videoUrl: 'https://meet.example.test', active: true, version: 3 } as const;

describe('LocationForm', () => {
  it('US-9 CA-2: una ubicación nueva arranca presencial, con dirección, indicaciones y mapa', () => {
    render(<LocationForm />);
    expect(screen.getByRole('radio', { name: 'Presencial' })).toHaveProperty('checked', true);
    for (const label of [/^Nombre/, /^Dirección/, /^Indicaciones/, /^Mapa/]) expect(screen.getByLabelText(label)).toBeDefined();
    expect(screen.queryByLabelText(/videollamada/)).toBeNull();
  });

  it('US-9 CA-3: al elegir Online pide sólo el link de la videollamada', () => {
    render(<LocationForm />);
    fireEvent.click(screen.getByRole('radio', { name: 'Online' }));
    expect(screen.getByLabelText(/^Link de la videollamada/)).toBeDefined();
    expect(screen.queryByLabelText(/^Dirección/)).toBeNull();
  });

  it('al editar, manda el id y la versión y muestra los datos guardados', () => {
    const { container } = render(<LocationForm location={ONLINE} />);
    expect(container.querySelector('input[name="id"]')?.getAttribute('value')).toBe(ONLINE.id);
    expect(container.querySelector('input[name="version"]')?.getAttribute('value')).toBe('3');
    expect(screen.getByLabelText(/^Link de la videollamada/)).toHaveProperty('value', 'https://meet.example.test');
  });
});
