import { ArrowRight, Inbox } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { DARK_BUTTON } from '@/components/form/form-parts';

export function PendingRequestsCard({ count }: { count: number }): ReactElement | null {
  if (count === 0) return null;
  return (
    <section aria-label='Solicitudes por confirmar' className='flex flex-wrap items-center justify-between gap-4 rounded-panel bg-background p-4 md:p-5'>
      <div className='flex items-center gap-4'>
        <span aria-hidden='true' className='flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/25'>
          <Inbox className='size-5' strokeWidth={2} />
        </span>
        <p className='text-[16px] font-semibold'>{count === 1 ? 'Tenés 1 solicitud por confirmar' : `Tenés ${count} solicitudes por confirmar`}</p>
      </div>
      <Link href='/admin/solicitudes' className={DARK_BUTTON}>
        Ver solicitudes
        <ArrowRight aria-hidden='true' className='size-5' />
      </Link>
    </section>
  );
}
