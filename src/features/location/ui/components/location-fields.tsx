import { Building2, Check, Video } from 'lucide-react';
import type { ReactElement } from 'react';
import { Field } from '@/components/form/form-parts';
import type { LocationRow } from '../../domain/location.schema';

type Kind = LocationRow['kind'];

const KINDS: ReadonlyArray<{ value: Kind; title: string; lead: string; Icon: typeof Video }> = [
  { value: 'IN_PERSON', title: 'Presencial', lead: 'En un consultorio físico', Icon: Building2 },
  { value: 'ONLINE', title: 'Online', lead: 'Por videollamada', Icon: Video },
];

export function KindChoice({ kind, onChange }: { kind: Kind; onChange: (kind: Kind) => void }): ReactElement {
  return (
    <fieldset className='grid gap-3 sm:grid-cols-2'>
      <legend className='sr-only'>Tipo de atención</legend>
      {KINDS.map(({ value, title, lead, Icon }) => (
        <label
          key={value}
          className='hover-shade group flex cursor-pointer items-center gap-4 rounded-panel border-2 border-transparent bg-secondary p-4 has-checked:border-primary has-checked:bg-primary/20 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-foreground'
        >
          <input type='radio' name='kind' value={value} checked={kind === value} onChange={() => onChange(value)} className='sr-only' />
          <span aria-hidden='true' className='flex size-12 shrink-0 items-center justify-center rounded-full bg-background group-has-checked:bg-primary'>
            <Icon className='size-5' strokeWidth={2} />
          </span>
          <span className='flex flex-1 flex-col'>
            <span className='text-[17px] font-semibold'>{title}</span>
            <span className='text-[14px] text-muted-foreground'>{lead}</span>
          </span>
          <Check aria-hidden='true' className='hidden size-5 group-has-checked:block' strokeWidth={2.5} />
        </label>
      ))}
    </fieldset>
  );
}

export function LocationFields({ kind, location }: { kind: Kind; location?: LocationRow }): ReactElement {
  const example = kind === 'ONLINE' ? '«Consulta por videollamada»' : '«Consultorio Centro»';
  return (
    <div className='flex flex-col gap-5'>
      <Field name='name' label='Nombre' defaultValue={location?.name ?? ''} hint={`Así la ven los pacientes, por ejemplo ${example}.`} />
      {kind === 'ONLINE' ? (
        <Field name='videoUrl' label='Link de la videollamada' type='url' defaultValue={location?.videoUrl ?? ''} hint='Tu sala fija de Meet o Zoom. Va en el email del turno.' />
      ) : (
        <>
          <Field name='address' label='Dirección' defaultValue={location?.address ?? ''} hint='Calle, número y ciudad.' />
          <Field name='directions' label='Indicaciones (opcional)' defaultValue={location?.directions ?? ''} required={false} hint='Piso, timbre o consultorio.' />
          <Field name='mapUrl' label='Mapa (opcional)' defaultValue={location?.mapUrl ?? ''} required={false} hint='En Google Maps: Compartir → Insertar un mapa → Copiar HTML, y pegalo acá.' />
        </>
      )}
    </div>
  );
}
