import { Check } from 'lucide-react';
import type { ReactElement } from 'react';
import { PRIMARY_BUTTON } from '@/components/form/form-parts';

type ConfirmFormProps = { id: string; version: number; action: (formData: FormData) => void; busy: boolean };

export function ConfirmForm({ id, version, action, busy }: ConfirmFormProps): ReactElement {
  return (
    <form action={action}>
      <input type='hidden' name='id' value={id} />
      <input type='hidden' name='version' value={version} />
      <button type='submit' disabled={busy} className={`${PRIMARY_BUTTON} w-full`}>
        <Check aria-hidden='true' className='size-5' strokeWidth={2} />
        {busy ? 'Confirmando…' : 'Confirmar'}
      </button>
    </form>
  );
}
