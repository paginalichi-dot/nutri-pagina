'use server';

import { requireAdmin } from '@/features/auth/actions/require-admin';
import { type ActionResult, failValidation } from '@/lib/action-result';
import { toActionFailure } from '@/lib/db-errors';
import { formFields } from '@/lib/form-data';
import { LocationInputSchema, RecordRefSchema } from '../domain/location.schema';
import { locationService } from '../services/location.service';
import { locationFields } from './location-fields';
import { refreshLocations } from './refresh-locations';

export async function saveLocation(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const ref = RecordRefSchema.safeParse(formFields(formData, ['id', 'version']));
    const parsed = LocationInputSchema.safeParse(locationFields(formData));
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    if (!ref.success) return failValidation(ref.error.issues[0]?.message);
    await locationService.update(ref.data, parsed.data);
    refreshLocations();
    return { success: true, message: 'Guardamos los cambios.' };
  } catch (error) {
    return toActionFailure(error, 'la ubicación');
  }
}
