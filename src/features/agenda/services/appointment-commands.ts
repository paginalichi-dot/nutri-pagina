import { addMinutes } from '@/lib/argentina-time';
import type { EmailSender } from '@/lib/email/send-email';
import { AppError } from '@/lib/errors';
import type { RecordRef } from '@/lib/record-ref';
import { whatsappLink } from '@/lib/whatsapp';
import { type AppointmentDetail, canTransition, isActiveStatus, type TimeRange } from '../domain/appointment.schema';
import type { ManualAppointmentInput, SlotChoice } from '../domain/booking.schema';
import type { AgendaRepository } from '../repository/agenda.repository';
import { appointmentEmail, type NoticeKind, whatsappMessage } from './appointment-notices';
import { assertSlotAvailable, mustFind } from './slot-check';

export type Notice = { emailSent: boolean | null; whatsappUrl: string };
export type ManualResult = Notice & { id: string; duplicateStartsAt: Date | null };
export type AgendaDependencies = { repository: AgendaRepository; clock: () => Date; sendEmail: EmailSender };

export type AppointmentCommands = {
  createManual(input: ManualAppointmentInput): Promise<ManualResult>;
  cancel(ref: RecordRef): Promise<Notice>;
  confirm(ref: RecordRef): Promise<Notice>;
  markAttendance(ref: RecordRef, attended: boolean): Promise<void>;
  reschedule(ref: RecordRef, choice: SlotChoice): Promise<Notice>;
};

type NoticeSender = (kind: NoticeKind, detail: AppointmentDetail, previous?: Date | null) => Promise<Notice>;

function assertChangeable(detail: AppointmentDetail, now: Date): void {
  if (!isActiveStatus(detail.status) || detail.startsAt <= now) throw new AppError('INVALID_TRANSITION');
}

function noticeSender({ clock, sendEmail }: AgendaDependencies): NoticeSender {
  return async (kind, detail, previous = null) => {
    const email = appointmentEmail({ kind, detail, now: clock(), previous });
    return { emailSent: email ? await sendEmail(email) : null, whatsappUrl: whatsappLink(detail.patientPhone, whatsappMessage(kind, detail, previous)) };
  };
}

function bookManually(repository: AgendaRepository, input: ManualAppointmentInput, now: Date): Promise<{ id: string; duplicate: TimeRange | null }> {
  const { locationId, startsAt, name, phone, email, healthInsuranceId } = input;
  return repository.inTransaction(async (tx) => {
    const slotMinutes = await assertSlotAvailable(tx, { locationId, startsAt, now, ignoreId: null });
    const duplicate = email ? await tx.findActiveByEmail(email, now) : null;
    const patient = { patientName: name, patientPhone: phone, patientEmail: email, healthInsuranceId };
    const id = await tx.createAppointment({ locationId, startsAt, endsAt: addMinutes(startsAt, slotMinutes), status: 'CONFIRMED', source: 'PANEL', ...patient });
    return { id, duplicate };
  });
}

function move(repository: AgendaRepository, { ref, choice, now }: { ref: RecordRef; choice: SlotChoice; now: Date }): Promise<AppointmentDetail> {
  return repository.inTransaction(async (tx) => {
    const detail = await mustFind(tx, ref.id);
    assertChangeable(detail, now);
    const slotMinutes = await assertSlotAvailable(tx, { locationId: choice.locationId, startsAt: choice.startsAt, now, ignoreId: ref.id });
    await tx.moveAppointment(ref, { locationId: choice.locationId, startsAt: choice.startsAt, endsAt: addMinutes(choice.startsAt, slotMinutes) });
    return detail;
  });
}

export function appointmentCommands(dependencies: AgendaDependencies): AppointmentCommands {
  const { repository, clock } = dependencies;
  const notice = noticeSender(dependencies);
  return {
    async createManual(input) {
      const { id, duplicate } = await bookManually(repository, input, clock());
      return { id, duplicateStartsAt: duplicate?.startsAt ?? null, ...(await notice('confirmed', await mustFind(repository, id))) };
    },
    async cancel(ref) {
      const detail = await mustFind(repository, ref.id);
      assertChangeable(detail, clock());
      await repository.updateStatus(ref, 'CANCELLED');
      return notice('cancelled', detail);
    },
    async confirm(ref) {
      const detail = await mustFind(repository, ref.id);
      if (!canTransition(detail.status, 'CONFIRMED') || detail.startsAt <= clock()) throw new AppError('INVALID_TRANSITION');
      await repository.updateStatus(ref, 'CONFIRMED');
      return notice('confirmed', detail);
    },
    async markAttendance(ref, attended) {
      const detail = await mustFind(repository, ref.id);
      if (detail.status !== 'CONFIRMED' || detail.startsAt > clock()) throw new AppError('INVALID_TRANSITION');
      await repository.updateStatus(ref, attended ? 'ATTENDED' : 'NO_SHOW');
    },
    async reschedule(ref, choice) {
      const before = await move(repository, { ref, choice, now: clock() });
      return notice('rescheduled', await mustFind(repository, ref.id), before.startsAt);
    },
  };
}
