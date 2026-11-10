'use server';

import { revalidatePath } from 'next/cache';
import { type CurrentPatient, requirePatient } from '@/features/patient/actions/require-patient';
import { sendLater } from '@/features/patient/actions/send-later';
import { guardPublicAction } from '@/features/rate-limit/actions/guard-public-action';
import { type ActionResult, failValidation } from '@/lib/action-result';
import { whenText } from '@/lib/argentina-time';
import { toActionFailure } from '@/lib/db-errors';
import type { EmailMessage } from '@/lib/email/send-email';
import { formFields } from '@/lib/form-data';
import { RecordRefSchema } from '@/lib/record-ref';
import { OnlineBookingInputSchema, SlotChoiceSchema } from '../domain/booking.schema';
import { bookingService } from '../services/booking.service';

export type BookingResult = ActionResult<{ appointmentId: string }>;

async function asPatient(work: (patient: CurrentPatient) => Promise<BookingResult>): Promise<BookingResult> {
  try {
    const patient = await requirePatient();
    await guardPublicAction('booking', patient.email);
    return await work(patient);
  } catch (error) {
    return toActionFailure(error, 'el turno');
  }
}

const sendAll = (emails: EmailMessage[]): void => emails.forEach(sendLater);

export async function bookAppointment(_previous: BookingResult | null, formData: FormData): Promise<BookingResult> {
  return asPatient(async (patient) => {
    const parsed = OnlineBookingInputSchema.safeParse(formFields(formData, ['locationId', 'startsAt', 'healthInsuranceId']));
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    const { id, emails } = await bookingService().book(patient, parsed.data);
    sendAll(emails);
    return { success: true, message: `Pediste un turno para el ${whenText(parsed.data.startsAt)}.`, data: { appointmentId: id } };
  });
}

export async function cancelMyAppointment(_previous: BookingResult | null, formData: FormData): Promise<BookingResult> {
  return asPatient(async ({ email }) => {
    const ref = RecordRefSchema.safeParse(formFields(formData, ['id', 'version']));
    if (!ref.success) return failValidation(ref.error.issues[0]?.message);
    sendAll(await bookingService().cancelMine(ref.data, email));
    revalidatePath('/mi-espacio', 'layout');
    return { success: true, message: 'Cancelaste tu turno. Le avisamos a Lisandro.', data: { appointmentId: ref.data.id } };
  });
}

export async function rescheduleMyAppointment(_previous: BookingResult | null, formData: FormData): Promise<BookingResult> {
  return asPatient(async ({ email }) => {
    const ref = RecordRefSchema.safeParse(formFields(formData, ['id', 'version']));
    const choice = SlotChoiceSchema.safeParse(formFields(formData, ['locationId', 'startsAt']));
    if (!ref.success) return failValidation(ref.error.issues[0]?.message);
    if (!choice.success) return failValidation(choice.error.issues[0]?.message);
    sendAll(await bookingService().rescheduleMine(ref.data, choice.data, email));
    const message = `Pediste el cambio al ${whenText(choice.data.startsAt)}. Lisandro lo tiene que confirmar.`;
    return { success: true, message, data: { appointmentId: ref.data.id } };
  });
}
