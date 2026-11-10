import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS, PRIMARY_BUTTON } from '@/components/form/form-parts';
import { PanelPage } from '@/components/panel/panel-page';
import type { LocationStats } from '../../domain/new-location.schema';
import type { LocationWithHours } from '../../domain/public-location.schema';
import { LocationDetail } from './location-detail';
import { LocationList } from './location-list';

type ScreenProps = { locations: LocationWithHours[]; selected: { location: LocationWithHours; stats: LocationStats } | null; focus: 'list' | 'detail' };

export function LocationsScreen({ locations, selected, focus }: ScreenProps): ReactElement {
  const onDetail = focus === 'detail';
  return (
    <PanelPage
      wide
      title={
        <>
          Tus <strong className='font-bold'>ubicaciones</strong>
        </>
      }
      lead='Los consultorios donde atendés y la atención online, con sus horarios.'
      actions={
        <Link href='/admin/ubicaciones/nueva' className={PRIMARY_BUTTON}>
          <Plus aria-hidden='true' className='size-5' strokeWidth={2.5} />
          Nueva ubicación
        </Link>
      }
    >
      <div className='grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]'>
        <div className={onDetail ? 'hidden lg:block' : ''}>
          <LocationList locations={locations} selectedId={selected?.location.id ?? null} />
        </div>
        {selected ? (
          <div className={`flex flex-col gap-4 ${onDetail ? '' : 'hidden lg:flex'}`}>
            {onDetail ? (
              <Link href='/admin/ubicaciones' className={`flex h-11 items-center gap-2 self-start rounded-control text-[15px] font-semibold lg:hidden ${FOCUS}`}>
                <ArrowLeft aria-hidden='true' className='size-5' strokeWidth={2.5} />
                Volver a ubicaciones
              </Link>
            ) : null}
            <LocationDetail location={selected.location} stats={selected.stats} />
          </div>
        ) : null}
      </div>
    </PanelPage>
  );
}
