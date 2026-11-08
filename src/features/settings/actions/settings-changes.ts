'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { requireAdmin } from '@/features/auth/actions/require-admin';
import { type ActionResult, failValidation } from '@/lib/action-result';
import { toActionFailure } from '@/lib/db-errors';
import { formFields } from '@/lib/form-data';
import { RecordRefSchema } from '@/lib/record-ref';
import { HealthInsuranceInputSchema, SlotMinutesInputSchema } from '../domain/settings.schema';
import { settingsService } from '../services/settings.service';
import { HEALTH_INSURANCES_TAG } from './settings-tags';

async function run(entity: string, work: () => Promise<ActionResult>): Promise<ActionResult> {
  try {
    await requireAdmin();
    const result = await work();
    if (result.success) {
      updateTag(HEALTH_INSURANCES_TAG);
      revalidatePath('/admin', 'layout');
    }
    return result;
  } catch (error) {
    return toActionFailure(error, entity);
  }
}

export async function saveSlotMinutes(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return run('la duración', async () => {
    const parsed = SlotMinutesInputSchema.safeParse(formFields(formData, ['slotMinutes', 'version']));
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    await settingsService.saveSlotMinutes(parsed.data);
    return { success: true, message: `Listo: los turnos duran ${parsed.data.slotMinutes} minutos.` };
  });
}

export async function createHealthInsurance(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return run('la obra social', async () => {
    const parsed = HealthInsuranceInputSchema.safeParse(formFields(formData, ['name']));
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    await settingsService.createHealthInsurance(parsed.data.name);
    return { success: true, message: `Agregamos ${parsed.data.name}.` };
  });
}

export async function renameHealthInsurance(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return run('la obra social', async () => {
    const ref = RecordRefSchema.safeParse(formFields(formData, ['id', 'version']));
    const parsed = HealthInsuranceInputSchema.safeParse(formFields(formData, ['name']));
    if (!ref.success) return failValidation(ref.error.issues[0]?.message);
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    await settingsService.renameHealthInsurance(ref.data, parsed.data.name);
    return { success: true, message: 'Guardamos el nombre.' };
  });
}

export async function setHealthInsuranceActive(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return run('la obra social', async () => {
    const ref = RecordRefSchema.safeParse(formFields(formData, ['id', 'version']));
    if (!ref.success) return failValidation(ref.error.issues[0]?.message);
    const active = formData.get('active') === 'true';
    await settingsService.setHealthInsuranceActive(ref.data, active);
    return { success: true, message: active ? 'Vuelve a ofrecerse.' : 'Ya no se ofrece.' };
  });
}
