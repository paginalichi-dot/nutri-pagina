import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HealthInsuranceList } from './health-insurance-list';
import { settingsTab, SettingsTabs } from './settings-tabs';
import { SlotMinutesForm } from './slot-minutes-form';

vi.mock('../../actions/settings-changes', () => ({
  saveSlotMinutes: vi.fn(),
  createHealthInsurance: vi.fn(),
  renameHealthInsurance: vi.fn(),
  setHealthInsuranceActive: vi.fn(),
}));

const ROWS = [
  { id: '00000000-0000-4000-8000-000000000001', name: 'Prepaga Uno', active: true, version: 1, appointments: 1 },
  { id: '00000000-0000-4000-8000-000000000002', name: 'Obra Dos', active: false, version: 3, appointments: 12 },
];

describe('Ajustes (US-44)', () => {
  it('CA-1: la pestaña de la URL queda marcada y cualquier otra cae en Duración', () => {
    render(<SettingsTabs active='obras-sociales' />);
    expect(screen.getByRole('link', { name: 'Obras sociales' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: 'Duración de los turnos' }).getAttribute('href')).toBe('/admin/ajustes?pestana=duracion');
    expect([settingsTab('obras-sociales'), settingsTab('otra'), settingsTab(undefined)]).toEqual(['obras-sociales', 'duracion', 'duracion']);
  });

  it('CA-2: una opción escribe sus minutos en el campo y queda marcada; el campo acepta otro número', () => {
    render(<SlotMinutesForm settings={{ slotMinutes: 45, version: 2 }} />);
    const field = screen.getByLabelText<HTMLInputElement>('Minutos por turno');
    expect(field.value).toBe('45');
    expect(field.getAttribute('placeholder')).toBe('Minutos, por ejemplo 50');
    expect(screen.getByRole('button', { name: '45 minutos' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: '90 minutos' }));
    expect(field.value).toBe('90');
    fireEvent.change(field, { target: { value: '52' } });
    expect(screen.getByRole('button', { name: '90 minutos' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('CA-3: cada fila trae su cantidad de turnos, un interruptor y el lápiz que abre el nombre', () => {
    render(<HealthInsuranceList rows={ROWS} />);
    expect(screen.getByText('1 turno')).toBeTruthy();
    expect(screen.getByText('12 turnos')).toBeTruthy();
    expect(screen.getByRole('switch', { name: 'Ofrecer Prepaga Uno' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('switch', { name: 'Ofrecer Obra Dos' }).getAttribute('aria-checked')).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: 'Renombrar Obra Dos' }));
    expect(screen.getByRole('form', { name: 'Nombre de Obra Dos' })).toBeTruthy();
    expect(screen.queryByRole('form', { name: 'Agregar una obra social' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Nueva obra social' }));
    expect(screen.getByRole('form', { name: 'Agregar una obra social' })).toBeTruthy();
  });
});
