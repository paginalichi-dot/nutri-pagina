'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/features/auth/actions/require-admin';
import { type ActionResult, failValidation } from '@/lib/action-result';
import { toActionFailure } from '@/lib/db-errors';
import { formFields } from '@/lib/form-data';
import { type RecordRef, RecordRefSchema } from '@/lib/record-ref';
import { ManualAppointmentInputSchema, SlotChoiceSchema } from '../domain/booking.schema';
import { whenText } from '@/lib/argentina-time';
import { agendaService } from '../services/agenda.service';
import type { Notice } from '../services/appointment-commands';
import { noticeMessage } from './notice-message';

export type NoticeData = { whatsappUrl: string; appointmentId: string };
type NoticeResult = ActionResult<NoticeData>;

const MANUAL_FIELDS = ['locationId', 'startsAt', 'name', 'phone', 'email', 'healthInsuranceId'] as const;

async function run(work: () => Promise<NoticeResult>): Promise<NoticeResult> {
  try {
    await requireAdmin();
    const result = await work();
    if (result.success) revalidatePath('/admin', 'layout');
    return result;
  } catch (error) {
    return toActionFailure(error, 'el turno');
  }
}

export async function createManualAppointment(_previous: NoticeResult | null, formData: FormData): Promise<NoticeResult> {
  return run(async () => {
    const parsed = ManualAppointmentInputSchema.safeParse(formFields(formData, MANUAL_FIELDS));
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    const { id, whatsappUrl, emailSent, duplicateStartsAt } = await agendaService.createManual(parsed.data);
    const message = noticeMessage({ done: `Turno guardado para el ${whenText(parsed.data.startsAt)}.`, emailSent, duplicateStartsAt });
    return { success: true, message, data: { whatsappUrl, appointmentId: id } };
  });
}

function changeStatus(formData: FormData, { done, change }: { done: string; change: (ref: RecordRef) => Promise<Notice> }): Promise<NoticeResult> {
  return run(async () => {
    const ref = RecordRefSchema.safeParse(formFields(formData, ['id', 'version']));
    if (!ref.success) return failValidation(ref.error.issues[0]?.message);
    const { whatsappUrl, emailSent } = await change(ref.data);
    return { success: true, message: noticeMessage({ done, emailSent }), data: { whatsappUrl, appointmentId: ref.data.id } };
  });
}

export async function cancelAppointment(_previous: NoticeResult | null, formData: FormData): Promise<NoticeResult> {
  return changeStatus(formData, { done: 'Turno cancelado.', change: (ref) => agendaService.cancel(ref) });
}

export async function confirmAppointment(_previous: NoticeResult | null, formData: FormData): Promise<NoticeResult> {
  return changeStatus(formData, { done: 'Turno confirmado.', change: (ref) => agendaService.confirm(ref) });
}

export async function rescheduleAppointment(_previous: NoticeResult | null, formData: FormData): Promise<NoticeResult> {
  return run(async () => {
    const ref = RecordRefSchema.safeParse(formFields(formData, ['id', 'version']));
    const choice = SlotChoiceSchema.safeParse(formFields(formData, ['locationId', 'startsAt']));
    if (!ref.success) return failValidation(ref.error.issues[0]?.message);
    if (!choice.success) return failValidation(choice.error.issues[0]?.message);
    const { whatsappUrl, emailSent } = await agendaService.reschedule(ref.data, choice.data);
    const message = noticeMessage({ done: `Turno movido al ${whenText(choice.data.startsAt)}.`, emailSent });
    return { success: true, message, data: { whatsappUrl, appointmentId: ref.data.id } };
  });
}

export async function markAttendance(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const ref = RecordRefSchema.safeParse(formFields(formData, ['id', 'version']));
    if (!ref.success) return failValidation(ref.error.issues[0]?.message);
    const attended = formData.get('attended') === 'true';
    await agendaService.markAttendance(ref.data, attended);
    revalidatePath('/admin', 'layout');
    return { success: true, message: attended ? 'Marcado: asistió.' : 'Marcado: ausente.' };
  } catch (error) {
    return toActionFailure(error, 'el turno');
  }
}
