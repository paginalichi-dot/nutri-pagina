import { describe, expect, it } from 'vitest';
import { activeSection, PANEL_SECTIONS } from './panel-sections';

describe('activeSection', () => {
  it.each([
    ['/admin', 'Agenda'],
    ['/admin/turnos/nuevo', 'Agenda'],
    ['/admin/bloqueos', 'Agenda'],
    ['/admin/pacientes', 'Pacientes'],
    ['/admin/ubicaciones', 'Ubicaciones'],
    ['/admin/ubicaciones/123', 'Ubicaciones'],
    ['/admin/ajustes', 'Ajustes'],
    ['/admin/cuenta', 'Mi cuenta'],
  ])('%s marca %s', (pathname, label) => {
    expect(activeSection(pathname)?.label).toBe(label);
  });

  it.each(['/admin/desconocida', '/admin/ubicacionesx', '/'])('%s no marca ninguna sección', (pathname) => {
    expect(activeSection(pathname)).toBeNull();
  });

  it('el menú tiene Agenda, Pacientes, Ubicaciones, Ajustes y Mi cuenta, en ese orden', () => {
    expect(PANEL_SECTIONS.map(({ label }) => label)).toEqual(['Agenda', 'Pacientes', 'Ubicaciones', 'Ajustes', 'Mi cuenta']);
  });
});
