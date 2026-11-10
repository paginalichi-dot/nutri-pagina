'use client';

import { type ReactElement, useActionState } from 'react';
import { FormFeedback } from '@/components/form/form-parts';
import { PublicField } from '@/components/form/public-form-parts';
import { updateProfile } from '../../actions/account-changes';
import type { PatientProfile } from '../../domain/patient.schema';
import { SubmitPill } from './account-card';

export function ProfileForm({ profile }: { profile: PatientProfile }): ReactElement {
  const [state, action, pending] = useActionState(updateProfile, null);
  return (
    <form key={profile.version} action={action} className='flex flex-col gap-4'>
      <input type='hidden' name='version' value={profile.version} />
      <PublicField name='name' label='Nombre' autoComplete='name' defaultValue={profile.name} />
      <PublicField name='phone' label='Teléfono (WhatsApp)' type='tel' autoComplete='tel' defaultValue={profile.phone} />
      <FormFeedback state={state} />
      <SubmitPill pending={pending} idle='Guardar' busy='Guardando…' />
    </form>
  );
}
