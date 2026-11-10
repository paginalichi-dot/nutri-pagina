'use server';

import { redirect } from 'next/navigation';
import { requireAdmin } from '@/features/auth/actions/require-admin';
import { type ActionResult, failValidation } from '@/lib/action-result';
import { toActionFailure } from '@/lib/db-errors';
import { NewLocationInputSchema } from '../domain/new-location.schema';
import { locationService } from '../services/location.service';
import { newLocationFields } from './location-fields';
import { refreshLocations } from './refresh-locations';

export async function createLocation(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  let id: string;
  try {
    await requireAdmin();
    const parsed = NewLocationInputSchema.safeParse(newLocationFields(formData));
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    id = (await locationService.createWithHours(parsed.data)).id;
    refreshLocations();
  } catch (error) {
    return toActionFailure(error, 'la ubicación');
  }
  redirect(`/admin/ubicaciones/${id}`);
}
