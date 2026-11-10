import { CalendarDays, FileText } from 'lucide-react';
import type { ComponentType, ReactElement } from 'react';
import { BrandLogo } from '@/components/auth/brand-logo';

const PERKS: ReadonlyArray<{ label: string; Icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }> }> = [
  { label: 'Turnos', Icon: CalendarDays },
  { label: 'Historial', Icon: FileText },
];

export function LoginBrandPanel(): ReactElement {
  return (
    <aside data-enter='unfold-left' className='hidden flex-col justify-between bg-foreground p-12 text-background lg:flex xl:p-16'>
      <div className='flex items-center gap-4'>
        <BrandLogo alt='' />
        <span className='text-[15px] font-semibold tracking-[1px] uppercase'>Lic. Lisandro López</span>
      </div>
      <div className='flex flex-col gap-6'>
        <p className='text-[clamp(3.5rem,6.2vw,6.5rem)] leading-[0.98] font-extrabold'>
          Tu salud,
          <br />
          en <span className='text-primary'>foco.</span>
        </p>
        <p className='text-xl font-medium text-footer-text'>Tus turnos de nutrición, en un solo lugar.</p>
      </div>
      <ul className='flex gap-8'>
        {PERKS.map(({ label, Icon }) => (
          <li key={label} className='flex flex-col items-center gap-3 text-[14px] font-medium text-footer-text'>
            <span className='flex size-14 items-center justify-center rounded-full border border-line-on-dark text-primary'>
              <Icon aria-hidden className='size-6' />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
