import { addMinutes } from '@/lib/argentina-time';
import { AppError, isAppError } from '@/lib/errors';
import type { RecordRef } from '@/lib/record-ref';
import { type AppointmentDetail, isActiveStatus } from '../domain/appointment.schema';
import type { OnlineBookingInput, SlotChoice } from '../domain/booking.schema';
import { MAX_UPCOMING, patientCanChange, REQUEST_EXPIRY_HOURS } from '../domain/patient-change';
import type { AgendaRepository } from '../repository/agenda.repository';
import { assertSlotAvailable } from './slot-check';

export type BookingPatient = { name: string; phone: string; email: string };
export type MineRequest = { ref: RecordRef; email: string; now: Date };
type BookRequest = { patient: BookingPatient; input: OnlineBookingInput; now: Date };

export function bookOnline(repository: AgendaRepository, { patient, input, now }: BookRequest): Promise<string> {
  const { locationId, startsAt, healthInsuranceId } = input;
  return repository.inTransaction(async (tx) => {
    if ((await tx.countUpcomingByEmail(patient.email, now)) >= MAX_UPCOMING) throw new AppError('BOOKING_LIMIT');
    const slotMinutes = await assertSlotAvailable(tx, { locationId, startsAt, now, ignoreId: null, scope: 'public' });
    const contact = { patientName: patient.name, patientPhone: patient.phone, patientEmail: patient.email, healthInsuranceId };
    return tx.createAppointment({ locationId, startsAt, endsAt: addMinutes(startsAt, slotMinutes), status: 'PENDING', source: 'ONLINE', ...contact });
  });
}

export async function findMine(repository: AgendaRepository, { id, email }: { id: string; email: string }): Promise<AppointmentDetail> {
  const detail = await repository.findAppointment(id);
  if (!detail || detail.patientEmail !== email) throw new AppError('NOT_FOUND', { entity: 'el turno' });
  return detail;
}

async function changeableMine(repository: AgendaRepository, { ref, email, now }: MineRequest): Promise<AppointmentDetail> {
  const detail = await findMine(repository, { id: ref.id, email });
  if (!isActiveStatus(detail.status) || detail.startsAt <= now) throw new AppError('INVALID_TRANSITION');
  if (!patientCanChange(detail, now)) throw new AppError('CHANGE_TOO_LATE');
  return detail;
}

export async function cancelMine(repository: AgendaRepository, request: MineRequest): Promise<AppointmentDetail> {
  const detail = await changeableMine(repository, request);
  await repository.updateStatus(request.ref, 'CANCELLED');
  return detail;
}

export function rescheduleMine(repository: AgendaRepository, { choice, ...request }: MineRequest & { choice: SlotChoice }): Promise<AppointmentDetail> {
  const { locationId, startsAt } = choice;
  return repository.inTransaction(async (tx) => {
    const before = await changeableMine(tx, request);
    const slotMinutes = await assertSlotAvailable(tx, { locationId, startsAt, now: request.now, ignoreId: request.ref.id, scope: 'public' });
    await tx.moveAppointment(request.ref, { locationId, startsAt, endsAt: addMinutes(startsAt, slotMinutes), status: 'PENDING' });
    return before;
  });
}

async function cancelIfUnchanged(repository: AgendaRepository, detail: AppointmentDetail): Promise<boolean> {
  try {
    await repository.updateStatus(detail, 'CANCELLED');
    return true;
  } catch (error) {
    if (isAppError(error) && error.code === 'STALE_VERSION') return false;
    throw error;
  }
}

export async function expirePending(repository: AgendaRepository, now: Date): Promise<AppointmentDetail[]> {
  const expiring = await repository.listExpiringPending({ startsAt: now, endsAt: addMinutes(now, REQUEST_EXPIRY_HOURS * 60) });
  const cancelled: AppointmentDetail[] = [];
  for (const detail of expiring) if (await cancelIfUnchanged(repository, detail)) cancelled.push(detail);
  return cancelled;
}
