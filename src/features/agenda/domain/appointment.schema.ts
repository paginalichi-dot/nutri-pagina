import { z } from 'zod';
import type { BlockRow } from './block.schema';

export const APPOINTMENT_STATUSES = ['PENDING', 'CONFIRMED', 'ATTENDED', 'NO_SHOW', 'CANCELLED'] as const;
export const ACTIVE_STATUSES = ['PENDING', 'CONFIRMED'] as const;
export const APPOINTMENT_SOURCES = ['ONLINE', 'PANEL'] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const STATUS_LABELS: Readonly<Record<AppointmentStatus, string>> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  ATTENDED: 'Asistió',
  NO_SHOW: 'Ausente',
  CANCELLED: 'Cancelado',
};

const NEXT_STATUSES: Readonly<Record<AppointmentStatus, readonly AppointmentStatus[]>> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['ATTENDED', 'NO_SHOW', 'CANCELLED'],
  ATTENDED: [],
  NO_SHOW: [],
  CANCELLED: [],
};

export function canTransition(from: AppointmentStatus, to: AppointmentStatus): boolean {
  return NEXT_STATUSES[from].includes(to);
}

export const isActiveStatus = (status: AppointmentStatus): boolean => status === 'PENDING' || status === 'CONFIRMED';

export const AppointmentRowSchema = z.object({
  id: z.uuid(),
  locationId: z.uuid(),
  locationName: z.string(),
  startsAt: z.date(),
  endsAt: z.date(),
  status: z.enum(APPOINTMENT_STATUSES),
  source: z.enum(APPOINTMENT_SOURCES),
  patientName: z.string(),
  patientPhone: z.string(),
  patientEmail: z.string().nullable(),
  healthInsuranceName: z.string().nullable(),
  version: z.int().positive(),
});

export const AppointmentPlaceSchema = z.object({
  kind: z.enum(['IN_PERSON', 'ONLINE']),
  address: z.string().nullable(),
  directions: z.string().nullable(),
  videoUrl: z.string().nullable(),
});

export const AppointmentDetailSchema = AppointmentRowSchema.extend({ place: AppointmentPlaceSchema });

export type AppointmentRow = z.infer<typeof AppointmentRowSchema>;
export type AppointmentDetail = z.infer<typeof AppointmentDetailSchema>;
export type TimeRange = { startsAt: Date; endsAt: Date };
export type AgendaView = { appointments: AppointmentRow[]; blocks: BlockRow[] };
export type PatientContact = { phone: string; email: string | null };

export type AgendaSummary = {
  today: { count: number; yesterday: number };
  week: { count: number; previous: number };
  newPatients: number;
  time: { freeMinutes: number; availableMinutes: number } | null;
  next: AppointmentDetail | null;
};
