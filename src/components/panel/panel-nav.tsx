'use client';

import { CalendarDays, MapPin, Settings2, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactElement, ReactNode } from 'react';
import { activeSection, PANEL_SECTIONS, type PanelSection } from './panel-sections';

const ICONS = { agenda: CalendarDays, locations: MapPin, settings: Settings2, account: UserRound } as const;
const FOCUS_ON_DARK = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

function NavLink({ section, current }: { section: PanelSection; current: boolean }): ReactElement {
  const Icon = ICONS[section.icon];
  const tone = current ? 'text-background' : 'text-footer-text hover:text-background';
  return (
    <Link
      href={section.href}
      aria-current={current ? 'page' : undefined}
      className={`relative flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-1 rounded-panel px-2 py-2 text-[12px] font-semibold md:flex-none md:flex-row md:justify-start md:gap-3 md:px-4 md:text-[15px] ${tone} ${FOCUS_ON_DARK}`}
    >
      {current ? <span aria-hidden='true' className='absolute top-0 h-1 w-8 rounded-full bg-primary md:top-1/2 md:left-0 md:h-6 md:w-1 md:-translate-y-1/2' /> : null}
      <Icon aria-hidden='true' className='size-5 shrink-0' strokeWidth={2} />
      {section.label}
    </Link>
  );
}

export function PanelNav({ footer }: { footer: ReactNode }): ReactElement {
  const current = activeSection(usePathname());
  return (
    <nav
      aria-label='Panel'
      className='fixed inset-x-0 bottom-0 z-40 bg-foreground pb-[env(safe-area-inset-bottom)] md:sticky md:top-0 md:flex md:h-svh md:w-60 md:shrink-0 md:flex-col md:justify-between md:p-6'
    >
      <div className='flex flex-col gap-8'>
        <p className='hidden text-lg font-semibold text-background md:block'>Lisandro López</p>
        <ul className='flex gap-1 px-2 py-1 md:flex-col md:p-0'>
          {PANEL_SECTIONS.map((section) => (
            <li key={section.href} className='flex flex-1 md:flex-none'>
              <NavLink section={section} current={current?.href === section.href} />
            </li>
          ))}
        </ul>
      </div>
      <div className='hidden md:block'>{footer}</div>
    </nav>
  );
}
