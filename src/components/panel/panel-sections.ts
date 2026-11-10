export type PanelSection = { href: string; label: string; icon: 'agenda' | 'patients' | 'locations' | 'settings' | 'account'; matches: readonly string[] };

export const PANEL_SECTIONS: readonly PanelSection[] = [
  { href: '/admin', label: 'Agenda', icon: 'agenda', matches: ['/admin', '/admin/turnos', '/admin/bloqueos', '/admin/solicitudes'] },
  { href: '/admin/pacientes', label: 'Pacientes', icon: 'patients', matches: ['/admin/pacientes'] },
  { href: '/admin/ubicaciones', label: 'Ubicaciones', icon: 'locations', matches: ['/admin/ubicaciones'] },
  { href: '/admin/ajustes', label: 'Ajustes', icon: 'settings', matches: ['/admin/ajustes'] },
  { href: '/admin/cuenta', label: 'Mi cuenta', icon: 'account', matches: ['/admin/cuenta'] },
];

const within = (pathname: string, prefix: string): boolean => pathname === prefix || pathname.startsWith(`${prefix}/`);

export function activeSection(pathname: string): PanelSection | null {
  const exact = (prefix: string): boolean => (prefix === '/admin' ? pathname === prefix : within(pathname, prefix));
  return PANEL_SECTIONS.find((section) => section.matches.some(exact)) ?? null;
}
