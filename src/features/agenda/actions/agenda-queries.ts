import 'server-only';
import { z } from 'zod';
import { guardAdminPage } from '@/features/auth/actions/require-admin';
import { isAppError } from '@/lib/errors';
import type { AgendaView, AppointmentDetail } from '../domain/appointment.schema';
import { SlotQuerySchema } from '../domain/booking.schema';
import { agendaService } from '../services/agenda.service';

export type SlotsResult = { slots: Date[]; error: string | null };

export async function getAgenda(day: string, days: number): Promise<AgendaView> {
  await guardAdminPage();
  return agendaService.agenda(day, days);
}

export async function getAppointment(id: string): Promise<AppointmentDetail | null> {
  await guardAdminPage();
  if (!z.uuid().safeParse(id).success) return null;
  try {
    return await agendaService.appointment(id);
  } catch (error) {
    if (isAppError(error) && error.code === 'NOT_FOUND') return null;
    throw error;
  }
}

export async function getPanelSlots(query: { locationId: string; day: string }, ignoreId: string | null = null): Promise<SlotsResult> {
  await guardAdminPage();
  const parsed = SlotQuerySchema.safeParse(query);
  if (!parsed.success) return { slots: [], error: parsed.error.issues[0]?.message ?? null };
  try {
    return { slots: await agendaService.slots(parsed.data, 'panel', ignoreId), error: null };
  } catch (error) {
    if (isAppError(error) && error.code === 'NO_SLOT_DURATION') return { slots: [], error: error.message };
    throw error;
  }
}
