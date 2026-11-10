import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AccountTabs } from './account-tabs';

vi.mock('../../actions/account-changes', () => ({
  updateProfile: vi.fn(),
  changePatientPassword: vi.fn(),
  requestEmailChange: vi.fn(),
  deleteAccount: vi.fn(),
}));

const profile = { id: 'p1', name: 'Ana Ficticia', email: 'ana@example.com', phone: '+5491100000000', version: 3 };
const IDS: Readonly<Record<string, string>> = { 'Tus datos': 'datos', 'Tu email': 'email', 'Eliminar mi cuenta': 'baja' };
const panel = (name: string): HTMLElement => document.getElementById(`panel-${IDS[name] ?? ''}`) ?? document.body;

describe('AccountTabs (Mi cuenta)', () => {
  it('arranca en «Tus datos» y muestra un formulario por vez', () => {
    render(<AccountTabs profile={profile} />);
    expect(screen.getByRole('tab', { name: 'Tus datos' }).getAttribute('aria-selected')).toBe('true');
    expect(panel('Tus datos').hidden).toBe(false);
    expect(panel('Tu email').hidden).toBe(true);
  });

  it('un clic cambia de pestaña y las flechas se mueven entre ellas', () => {
    render(<AccountTabs profile={profile} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Eliminar mi cuenta' }));
    expect(panel('Eliminar mi cuenta').hidden).toBe(false);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Eliminar mi cuenta' }), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tus datos' }));
    expect(panel('Tus datos').hidden).toBe(false);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Tus datos' }), { key: 'ArrowRight' });
    expect(panel('Tu email').hidden).toBe(false);
  });
});
