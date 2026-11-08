'use client';

import { CalendarDays, MapPin, Settings2, UserRound, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactElement, ReactNode } from 'react';
import logo from '@/app/icon.png';
import { activeSection, PANEL_SECTIONS, type PanelSection } from './panel-sections';

const ICONS = { agenda: CalendarDays, patients: Users, locations: MapPin, settings: Settings2, account: UserRound } as const;
const FOCUS_ON_DARK = 'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary';

function NavLink({ section, current }: { section: PanelSection; current: boolean }): ReactElement {
  const Icon = ICONS[section.icon];
  const tone = current ? 'text-background md:bg-background/10' : 'text-footer-text hover:text-background';
  return (
    <Link
      href={section.href}
      aria-current={current ? 'page' : undefined}
      className={`hover-shade hover-shade-on-dark flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-1 rounded-control px-1 py-2 text-[11px] font-semibold md:h-12 md:w-full md:flex-none md:flex-row md:justify-start md:gap-4 md:rounded-none md:px-6 md:text-[15px] ${tone} ${FOCUS_ON_DARK}`}
    >
      {current ? <span aria-hidden='true' className='absolute top-0 h-1 w-8 rounded-full bg-primary md:inset-y-0 md:left-0 md:h-auto md:w-1 md:rounded-none' /> : null}
      <Icon aria-hidden='true' className='size-5 shrink-0' strokeWidth={2} />
      {section.label}
    </Link>
  );
}

function Brand(): ReactElement {
  return (
    <div className='hidden items-center gap-3 px-6 md:flex'>
      <Image src={logo} alt='' width={44} height={44} className='size-11 rounded-full bg-background' />
      <div className='flex flex-col gap-0.5'>
        <p className='text-[17px] leading-tight font-semibold text-background'>Lisandro López</p>
        <p className='text-[11px] font-semibold tracking-[1px] text-footer-text'>NUTRICIONISTA</p>
      </div>
    </div>
  );
}

export function PanelNav({ footer }: { footer: ReactNode }): ReactElement {
  const current = activeSection(usePathname());
  return (
    <nav
      aria-label='Panel'
      className='fixed inset-x-0 bottom-0 z-40 bg-foreground pb-[env(safe-area-inset-bottom)] md:sticky md:top-0 md:flex md:h-svh md:w-60 md:shrink-0 md:flex-col md:justify-between md:py-6'
    >
      <div className='flex flex-col gap-10'>
        <Brand />
        <ul className='flex gap-0.5 px-1 py-1 md:flex-col md:gap-1 md:p-0'>
          {PANEL_SECTIONS.map((section) => (
            <li key={section.href} className='flex flex-1 md:flex-none'>
              <NavLink section={section} current={current?.href === section.href} />
            </li>
          ))}
        </ul>
      </div>
      <div className='mx-6 hidden border-t border-line-on-dark pt-4 md:block'>{footer}</div>
    </nav>
  );
}
