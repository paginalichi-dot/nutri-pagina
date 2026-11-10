import { adminRepository } from '@/features/auth/repository/admin.repository';
import { appUrlFromEnv } from '@/lib/app-url';
import type { EmailMessage } from '@/lib/email/send-email';
import type { RecordRef } from '@/lib/record-ref';
import type { AppointmentDetail } from '../domain/appointment.schema';
import type { OnlineBookingInput, SlotChoice } from '../domain/booking.schema';
import { MAX_UPCOMING } from '../domain/patient-change';
import { type AgendaRepository, agendaRepository } from '../repository/agenda.repository';
import { appointmentEmail } from './appointment-notices';
import { bookableDays } from './booking-days';
import { type BookingEvent, lisandroEmail, patientRequestEmail } from './booking-notices';
import { type BookingPatient, bookOnline, cancelMine, expirePending, findMine, rescheduleMine } from './patient-bookings';

export type BookingDependencies = { repository: AgendaRepository; clock: () => Date; appUrl: string; adminEmail: () => Promise<string | null> };

export type BookingService = {
  book(patient: BookingPatient, input: OnlineBookingInput): Promise<{ id: string; emails: EmailMessage[] }>;
  cancelMine(ref: RecordRef, email: string): Promise<EmailMessage[]>;
  rescheduleMine(ref: RecordRef, choice: SlotChoice, email: string): Promise<EmailMessage[]>;
  expire(): Promise<EmailMessage[]>;
  roomLeft(email: string): Promise<number>;
  findMine(id: string, email: string): Promise<AppointmentDetail>;
  bookableDays(locationId: string): Promise<string[]>;
};

const present = (messages: (EmailMessage | null)[]): EmailMessage[] => messages.filter((message) => message !== null);

export function createBookingService(dependencies: BookingDependencies): BookingService {
  const { repository, clock, appUrl } = dependencies;
  const fresh = (id: string): Promise<AppointmentDetail | null> => repository.findAppointment(id);
  async function toLisandro(event: BookingEvent, detail: AppointmentDetail, previous: Date | null = null): Promise<EmailMessage | null> {
    const to = await dependencies.adminEmail();
    return to ? lisandroEmail(event, { detail, appUrl, previous, to }) : null;
  }
  async function notifyRequest(event: 'requested' | 'change-requested', id: string, previous: Date | null = null): Promise<EmailMessage[]> {
    const detail = await fresh(id);
    if (!detail) return [];
    return present([patientRequestEmail(event, { detail, appUrl, previous }), await toLisandro(event, detail, previous)]);
  }
  return {
    async book(patient, input) {
      const id = await bookOnline(repository, { patient, input, now: clock() });
      return { id, emails: await notifyRequest('requested', id) };
    },
    async cancelMine(ref, email) {
      const detail = await cancelMine(repository, { ref, email, now: clock() });
      return present([appointmentEmail({ kind: 'cancelled', detail, now: clock() }), await toLisandro('cancelled', detail)]);
    },
    async rescheduleMine(ref, choice, email) {
      const before = await rescheduleMine(repository, { ref, choice, email, now: clock() });
      return notifyRequest('change-requested', ref.id, before.startsAt);
    },
    async expire() {
      const cancelled = await expirePending(repository, clock());
      return present(cancelled.map((detail) => appointmentEmail({ kind: 'cancelled', detail, now: clock() })));
    },
    roomLeft: async (email) => Math.max(0, MAX_UPCOMING - (await repository.countUpcomingByEmail(email, clock()))),
    findMine: (id, email) => findMine(repository, { id, email }),
    bookableDays: (locationId) => bookableDays(repository, { locationId, now: clock() }),
  };
}

export const bookingService = (): BookingService =>
  createBookingService({ repository: agendaRepository, clock: () => new Date(), appUrl: appUrlFromEnv(process.env), adminEmail: () => adminRepository.findEmail() });
