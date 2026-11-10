'use server';

import { requireAdmin } from '@/features/auth/actions/require-admin';
import { type ActionResult, failValidation } from '@/lib/action-result';
import { toActionFailure } from '@/lib/db-errors';
import { formFields } from '@/lib/form-data';
import { WeeklyHoursInputSchema, WeeklyHoursUpdateSchema } from '../domain/hours.schema';
import { RecordRefSchema } from '../domain/location.schema';
import { locationService } from '../services/location.service';
import { refreshLocations } from './refresh-locations';

async function run(work: () => Promise<ActionResult>): Promise<ActionResult> {
  try {
    await requireAdmin();
    const result = await work();
    if (result.success) refreshLocations();
    return result;
  } catch (error) {
    return toActionFailure(error, 'la ubicación');
  }
}

export async function setLocationActive(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return run(async () => {
    const ref = RecordRefSchema.safeParse(formFields(formData, ['id', 'version']));
    if (!ref.success) return failValidation(ref.error.issues[0]?.message);
    const active = formData.get('active') === 'true';
    await locationService.setActive(ref.data, active);
    return { success: true, message: active ? 'La ubicación vuelve a ofrecerse.' : 'La ubicación ya no se ofrece.' };
  });
}

export async function addHours(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return run(async () => {
    const parsed = WeeklyHoursInputSchema.safeParse(formFields(formData, ['locationId', 'weekday', 'start', 'end']));
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    await locationService.addHours(parsed.data);
    return { success: true, message: 'Agregamos la franja.' };
  });
}

export async function updateHours(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return run(async () => {
    const parsed = WeeklyHoursUpdateSchema.safeParse(formFields(formData, ['id', 'version', 'start', 'end']));
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    await locationService.updateHours(parsed.data.ref, parsed.data.range);
    return { success: true, message: 'Guardamos la franja.' };
  });
}

export async function deleteHours(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return run(async () => {
    const ref = RecordRefSchema.safeParse(formFields(formData, ['id', 'version']));
    if (!ref.success) return failValidation(ref.error.issues[0]?.message);
    await locationService.deleteHours(ref.data);
    return { success: true, message: 'Borramos la franja.' };
  });
}
