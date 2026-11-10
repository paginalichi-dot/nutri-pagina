import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BookingSummaryCard } from './booking-summary-card';
import { ModalityChoice } from './modality-choice';

vi.mock('@/features/patient/actions/logout-patient', () => ({ logoutPatient: vi.fn() }));

describe('modalidad y tarjeta «Tu turno» (US-40)', () => {
  it('CA-1: cada mitad entera es el link de su modalidad y se despliega desde su lado; «Cerrar sesión» queda arriba', () => {
    render(<ModalityChoice basePath='/reservar' available={new Set(['presencial', 'virtual'] as const)} back={{ href: '/', label: 'Volver al inicio' }} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Elegí cómo querés tu consulta');
    const presencial = screen.getByRole('link', { name: 'Elegir presencial' });
    const virtual = screen.getByRole('link', { name: 'Elegir virtual' });
    expect([presencial.getAttribute('href'), virtual.getAttribute('href')]).toEqual(['/reservar?modalidad=presencial', '/reservar?modalidad=virtual']);
    expect([presencial.getAttribute('data-enter'), virtual.getAttribute('data-enter')]).toEqual(['unfold-left', 'unfold-right']);
    expect(presencial.contains(screen.getByRole('heading', { name: 'Presencial' }))).toBe(true);
    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'Volver al inicio' }).getAttribute('href')).toBe('/');
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeDefined();
  });

  it('CA-1: sin ubicación online, la mitad virtual lo dice y no tiene botón', () => {
    render(<ModalityChoice basePath='/reservar' available={new Set(['presencial'] as const)} back={{ href: '/', label: 'Volver al inicio' }} />);
    expect(screen.queryByRole('link', { name: /Elegir virtual/ })).toBeNull();
    expect(screen.getByText('Por ahora no hay turnos virtuales.')).toBeDefined();
  });

  it('CA-4: lo que falta dice «Pendiente», lo elegido se ve y la barra dice el paso', () => {
    const rows = [
      { icon: 'video', label: 'Modalidad', value: 'Por videollamada' },
      { icon: 'day', label: 'Día', value: 'jueves, 12 de noviembre' },
      { icon: 'time', label: 'Horario', value: null },
    ] as const;
    render(<BookingSummaryCard title='Tu turno · Virtual' changeHref='/reservar' rows={rows} progress={{ step: 2, total: 3 }} note='Podés reprogramar o cancelar tu turno hasta 24 hs antes.' />);
    expect(screen.getByText('Tu turno · Virtual')).toBeDefined();
    expect(screen.getByText('Pendiente')).toBeDefined();
    expect(screen.getByText('Paso 2 de 3')).toBeDefined();
    expect(screen.queryByText('Lugar')).toBeNull();
    expect(screen.getByText('Por videollamada · jueves, 12 de noviembre')).toBeDefined();
    expect(screen.getByRole('link', { name: 'Cambiar' }).getAttribute('href')).toBe('/reservar');
  });
});
