'use server';

import { redirect } from 'next/navigation';
import { requireAdmin } from '@/features/auth/actions/require-admin';
import { type ActionResult, failValidation } from '@/lib/action-result';
import { toActionFailure } from '@/lib/db-errors';
import { formFields } from '@/lib/form-data';
import { LocationInputSchema, RecordRefSchema } from '../domain/location.schema';
import { locationService } from '../services/location.service';
import { refreshLocations } from './refresh-locations';

const FIELDS = {
  IN_PERSON: ['kind', 'name', 'address', 'directions', 'mapUrl'],
  ONLINE: ['kind', 'name', 'videoUrl'],
} as const;

async function save(formData: FormData): Promise<ActionResult<string | null>> {
  const fields = formData.get('kind') === 'ONLINE' ? FIELDS.ONLINE : FIELDS.IN_PERSON;
  const parsed = LocationInputSchema.safeParse(formFields(formData, fields));
  if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
  if (!formData.has('id')) return { success: true, data: (await locationService.create(parsed.data)).id };
  const ref = RecordRefSchema.safeParse(formFields(formData, ['id', 'version']));
  if (!ref.success) return failValidation(ref.error.issues[0]?.message);
  await locationService.update(ref.data, parsed.data);
  return { success: true, data: null };
}

export async function saveLocation(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  let result: ActionResult<string | null>;
  try {
    await requireAdmin();
    result = await save(formData);
    if (result.success) refreshLocations();
  } catch (error) {
    return toActionFailure(error, 'la ubicación');
  }
  if (!result.success) return result;
  if (result.data) redirect(`/admin/ubicaciones/${result.data}`);
  return { success: true, message: 'Guardamos los cambios.' };
}
