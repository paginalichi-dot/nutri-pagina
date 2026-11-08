'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/features/auth/actions/require-admin';
import { type ActionResult, failValidation } from '@/lib/action-result';
import { toActionFailure } from '@/lib/db-errors';
import { formFields } from '@/lib/form-data';
import { RecordRefSchema } from '@/lib/record-ref';
import { BlockInputSchema } from '../domain/block.schema';
import { agendaService } from '../services/agenda.service';

async function run(work: () => Promise<ActionResult>): Promise<ActionResult> {
  try {
    await requireAdmin();
    const result = await work();
    if (result.success) revalidatePath('/admin', 'layout');
    return result;
  } catch (error) {
    return toActionFailure(error, 'el bloqueo');
  }
}

export async function createBlock(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return run(async () => {
    const parsed = BlockInputSchema.safeParse(formFields(formData, ['start', 'end', 'reason']));
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    await agendaService.createBlock(parsed.data);
    return { success: true, message: 'Bloqueo guardado: en ese rango no se ofrecen turnos.' };
  });
}

export async function deleteBlock(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return run(async () => {
    const ref = RecordRefSchema.safeParse(formFields(formData, ['id', 'version']));
    if (!ref.success) return failValidation(ref.error.issues[0]?.message);
    await agendaService.deleteBlock(ref.data);
    return { success: true, message: 'Bloqueo borrado.' };
  });
}
