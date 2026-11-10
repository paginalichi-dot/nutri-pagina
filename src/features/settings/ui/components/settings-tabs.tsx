import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS } from '@/components/form/form-parts';

export const SETTINGS_TABS = [
  { id: 'duracion', label: 'Duración de los turnos' },
  { id: 'obras-sociales', label: 'Obras sociales' },
] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number]['id'];

export function settingsTab(value: unknown): SettingsTab {
  return value === 'obras-sociales' ? 'obras-sociales' : 'duracion';
}

export function SettingsTabs({ active }: { active: SettingsTab }): ReactElement {
  return (
    <nav aria-label='Secciones de ajustes' className='flex gap-3 overflow-x-auto border-b border-border pb-4'>
      {SETTINGS_TABS.map(({ id, label }) => (
        <Link
          key={id}
          href={`/admin/ajustes?pestana=${id}`}
          aria-current={id === active ? 'page' : undefined}
          className={`hover-shade flex h-11 shrink-0 items-center rounded-control px-5 text-[15px] font-semibold ${id === active ? 'hover-shade-on-dark bg-foreground text-background' : 'bg-secondary'} ${FOCUS}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
