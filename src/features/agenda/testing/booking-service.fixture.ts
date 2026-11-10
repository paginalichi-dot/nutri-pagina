import type { EmailMessage } from '@/lib/email/send-email';
import { type BookingService, createBookingService } from '../services/booking.service';
import { type AgendaSetup, agendaSetup } from './agenda-service.fixture';

export const ANA = { name: 'Ana Prueba', phone: '11 2345-6789', email: 'ana@ejemplo.test' };
export const APP_URL = 'https://sitio.test';
export const LISANDRO = 'lisandro@ejemplo.test';
export const MONDAY_AT = (time: string): Date => new Date(`2026-11-09T${time}:00.000Z`);

export type BookingSetup = AgendaSetup & { booking: BookingService; admin: { email: string | null } };

export async function bookingSetup(): Promise<BookingSetup> {
  const setup = await agendaSetup();
  const admin: { email: string | null } = { email: LISANDRO };
  const booking = createBookingService({ repository: setup.repository, clock: () => setup.clock.now, appUrl: APP_URL, adminEmail: async () => admin.email });
  return { ...setup, booking, admin };
}

export const bookAt = (setup: BookingSetup, startsAt: Date, locationId = setup.centro): Promise<{ id: string; emails: EmailMessage[] }> =>
  setup.booking.book(ANA, { locationId, startsAt, healthInsuranceId: null });
