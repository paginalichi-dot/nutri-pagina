import 'server-only';
import { z } from 'zod';
import { guardPatientPage } from '@/features/patient/actions/require-patient';
import { isAppError } from '@/lib/errors';
import { whatsappLink } from '@/lib/whatsapp';
import type { AppointmentDetail } from '../domain/appointment.schema';
import { type GridSlot, SlotQuerySchema } from '../domain/booking.schema';
import { agendaService } from '../services/agenda.service';
import { bookingService } from '../services/booking.service';

export type DaysResult = { days: string[]; error: string | null };
export type GridResult = { slots: GridSlot[]; error: string | null };

async function orSetupError<T>(work: () => Promise<T>, empty: T): Promise<{ value: T; error: string | null }> {
  try {
    return { value: await work(), error: null };
  } catch (error) {
    if (isAppError(error) && error.code === 'NO_SLOT_DURATION') return { value: empty, error: 'Todavía no hay turnos para reservar online. Probá más adelante.' };
    throw error;
  }
}

export async function getBookingDays(locationId: string): Promise<DaysResult> {
  await guardPatientPage();
  if (!z.uuid().safeParse(locationId).success) return { days: [], error: null };
  const { value, error } = await orSetupError(() => bookingService().bookableDays(locationId), []);
  return { days: value, error };
}

export async function getPublicSlots(query: { locationId: string; day: string }): Promise<GridResult> {
  await guardPatientPage();
  const parsed = SlotQuerySchema.safeParse(query);
  if (!parsed.success) return { slots: [], error: null };
  const { value, error } = await orSetupError(() => agendaService.grid(parsed.data), []);
  return { slots: value, error };
}

export async function bookingRoomLeft(): Promise<number> {
  const { email } = await guardPatientPage();
  return bookingService().roomLeft(email);
}

export async function getMyAppointment(id: string): Promise<AppointmentDetail | null> {
  const { email } = await guardPatientPage();
  if (!z.uuid().safeParse(id).success) return null;
  try {
    return await bookingService().findMine(id, email);
  } catch (error) {
    if (isAppError(error) && error.code === 'NOT_FOUND') return null;
    throw error;
  }
}

export async function lisandroWhatsapp(message: string): Promise<string | null> {
  const phone = process.env.LISANDRO_WHATSAPP?.trim();
  return phone ? whatsappLink(phone, message) : null;
}
