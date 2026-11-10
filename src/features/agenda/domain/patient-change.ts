import { type AppointmentStatus, isActiveStatus } from './appointment.schema';

export const CHANGE_NOTICE_HOURS = 24;
export const MAX_UPCOMING = 2;
export const REQUEST_EXPIRY_HOURS = 12;

export function patientCanChange({ status, startsAt }: { status: AppointmentStatus; startsAt: Date }, now: Date): boolean {
  return isActiveStatus(status) && startsAt.getTime() - now.getTime() >= CHANGE_NOTICE_HOURS * 3_600_000;
}

export const showsVideoLink = ({ status }: { status: AppointmentStatus }): boolean => status === 'CONFIRMED';
