import { Mail, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement, SVGProps } from 'react';
import logo from '@/app/icon.png';
import { ArrowDisc } from '@/components/arrow-disc';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground';

function InstagramGlyph(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' {...props}>
      <rect x='3' y='3' width='18' height='18' rx='5' />
      <circle cx='12' cy='12' r='4' />
      <path d='M17.5 6.5h.01' />
    </svg>
  );
}

export const CONTACTS = [
  { label: 'WhatsApp', text: '+54 9 280 497-8101', href: 'https://wa.me/5492804978101', Icon: MessageCircle },
  { label: 'Instagram', text: '@nutri.lopez', href: 'https://www.instagram.com/nutri.lopez/', Icon: InstagramGlyph },
  { label: 'Email', text: 'lisandroiglopez@gmail.com', href: 'mailto:lisandroiglopez@gmail.com', Icon: Mail },
] as const;

function Contacts(): ReactElement {
  return (
    <ul className='flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8'>
      {CONTACTS.map(({ label, text, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel='noopener noreferrer'
            aria-label={`${label}: ${text}`}
            className={`flex min-h-11 items-center gap-3 rounded-full pr-2 text-[15px] font-medium hover:underline ${FOCUS}`}
          >
            <span className='flex size-11 shrink-0 items-center justify-center rounded-full border border-foreground/40'>
              <Icon aria-hidden='true' className='size-5' strokeWidth={2} />
            </span>
            {text}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter({ year }: { year: number }): ReactElement {
  return (
    <footer data-site-footer className='relative z-20 flex flex-col items-center gap-8 bg-muted px-4 pt-16 pb-32 text-center md:px-20 md:pt-20 md:pb-40'>
      <Image src={logo} alt='Lisandro López Nutrición y Bienestar' width={80} height={80} className='size-20 rounded-full' />
      <h2 className='text-[28px] leading-[1.3] font-medium md:text-[38.4px]'>¿Empezamos?</h2>
      <Link
        href='/reservar'
        className={`hover-shade flex h-16 items-center gap-4 rounded-full bg-primary pr-2 pl-8 text-[17px] font-medium text-primary-foreground shadow-halo md:text-lg ${FOCUS}`}
      >
        Reservá tu turno
        <ArrowDisc className='size-12' />
      </Link>
      <Contacts />
      <p className='text-[12.8px] leading-[1.86] font-medium text-muted-foreground'>© {year} Lisandro López · Nutrición</p>
    </footer>
  );
}
