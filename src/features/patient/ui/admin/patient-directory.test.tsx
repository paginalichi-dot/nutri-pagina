import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { DirectoryEntry } from '../../domain/patient-directory.schema';
import { directoryPage, initials } from './directory-filter';
import { PatientDirectory } from './patient-directory';

function entry(index: number, overrides: Partial<DirectoryEntry> = {}): DirectoryEntry {
  const id = `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`;
  return { id, name: `Paciente ${String(index).padStart(2, '0')}`, email: `p${index}@ejemplo.test`, phone: `11 5555-${String(index).padStart(4, '0')}`, hasAccount: false, lastVisit: null, nextVisit: null, status: 'ACTIVE', ...overrides };
}

const MANY = Array.from({ length: 23 }, (_, index) => entry(index + 1));
const SOME = [
  entry(1, { name: 'María José Ruiz', email: 'maria@ejemplo.test', status: 'NEW', nextVisit: new Date('2026-11-26T13:00:00Z') }),
  entry(2, { name: 'Tomás Herrera', email: null, phone: '+54 9 11 5678-9012', status: 'INACTIVE', lastVisit: new Date('2026-04-12T13:00:00Z') }),
  entry(3, { name: 'Lucía Benítez', nextVisit: new Date('2026-11-24T13:00:00Z') }),
];

const table = (): HTMLElement => screen.getByRole('table', { name: 'Pacientes' });

describe('Pacientes (US-43)', () => {
  it('CA-2 y CA-4: pagina de a 20 y avanza con las flechas', () => {
    render(<PatientDirectory entries={MANY} />);
    expect(within(table()).getAllByRole('row')).toHaveLength(21);
    expect(screen.getByText('Mostrando 1–20 de 23')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Página siguiente' }));
    expect(screen.getByText('Mostrando 21–23 de 23')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Página siguiente' }).hasAttribute('disabled')).toBe(true);
  });

  it('CA-4: busca sin importar tildes ni mayúsculas, por email y por teléfono', () => {
    render(<PatientDirectory entries={SOME} />);
    const search = screen.getByRole('searchbox', { name: 'Buscar por nombre, email o teléfono' });
    fireEvent.change(search, { target: { value: 'lucia' } });
    expect(within(table()).getByText('Lucía Benítez')).toBeTruthy();
    expect(within(table()).queryByText('Tomás Herrera')).toBeNull();
    fireEvent.change(search, { target: { value: '5678 9012' } });
    expect(within(table()).getByText('Tomás Herrera')).toBeTruthy();
    fireEvent.change(search, { target: { value: 'nadie' } });
    expect(screen.getByText('No hay pacientes que coincidan.')).toBeTruthy();
  });

  it('CA-3 y CA-4: los filtros usan el estado y el próximo turno', () => {
    render(<PatientDirectory entries={SOME} />);
    fireEvent.click(screen.getByRole('button', { name: 'Nuevos este mes' }));
    expect(within(table()).getAllByRole('row')).toHaveLength(2);
    expect(within(table()).getByText('Nuevo')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Sin turno próximo' }));
    expect(within(table()).getByText('Tomás Herrera')).toBeTruthy();
    expect(within(table()).getByText('Sin email')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sin turno próximo' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('CA-5: «Ver» lleva a la ficha y «⋯» trae WhatsApp y Nuevo turno', () => {
    render(<PatientDirectory entries={SOME.slice(0, 1)} />);
    expect(within(table()).getByRole('link', { name: 'Ver a María José Ruiz' }).getAttribute('href')).toBe(`/admin/pacientes/${SOME[0]?.id}`);
    expect(within(table()).getByRole('link', { name: 'WhatsApp' }).getAttribute('href')).toContain('https://wa.me/');
    expect(within(table()).getByRole('link', { name: 'Nuevo turno' }).getAttribute('href')).toBe('/admin/turnos/nuevo');
  });

  it('sin pacientes explica cuándo aparecen; las iniciales usan las dos primeras palabras', () => {
    render(<PatientDirectory entries={[]} />);
    expect(screen.getByText('Todavía no tenés pacientes. Aparecen con su primer turno o al crear su cuenta.')).toBeTruthy();
    expect([initials('maría josé ruiz'), initials('  Ana  ')]).toEqual(['MJ', 'A']);
    expect(directoryPage(MANY, { query: '', filter: 'all', page: 99 }).page).toBe(2);
  });
});
