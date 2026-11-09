import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NewLocationScreen } from './new-location-screen';

vi.mock('../../actions/save-location', () => ({ saveLocation: vi.fn() }));

describe('NewLocationScreen', () => {
  it('el título y el botón dicen qué se carga: un consultorio o la atención online', () => {
    render(<NewLocationScreen />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Nuevo consultorio');
    expect(screen.getByRole('button', { name: 'Guardar consultorio' })).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Online'));
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Nueva atención online');
    expect(screen.getByRole('button', { name: 'Guardar atención online' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Volver a ubicaciones' }).getAttribute('href')).toBe('/admin/ubicaciones');
  });
});
