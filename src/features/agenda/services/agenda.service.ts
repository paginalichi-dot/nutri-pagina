import { addDays, argentinaInstant } from '@/lib/argentina-time';
import { emailSenderFromEnv } from '@/lib/email/send-email';
import { AppError } from '@/lib/errors';
import type { RecordRef } from '@/lib/record-ref';
import type { AgendaSummary, AgendaView, AppointmentDetail } from '../domain/appointment.schema';
import type { BlockInput } from '../domain/block.schema';
import type { SlotQuery } from '../domain/booking.schema';
import { agendaRepository } from '../repository/agenda.repository';
import { agendaSummary } from './agenda-summary';
import { type AgendaDependencies, type AppointmentCommands, appointmentCommands } from './appointment-commands';
import type { AvailabilityScope } from './availability';
import { mustFind, slotsFor } from './slot-check';

export type AgendaService = AppointmentCommands & {
  agenda(day: string, days: number): Promise<AgendaView>;
  summary(): Promise<AgendaSummary>;
  appointment(id: string): Promise<AppointmentDetail>;
  slots(query: SlotQuery, scope: AvailabilityScope, ignoreId?: string | null): Promise<Date[]>;
  createBlock(input: BlockInput): Promise<void>;
  deleteBlock(ref: RecordRef): Promise<void>;
};

export function createAgendaService(dependencies: AgendaDependencies): AgendaService {
  const { repository, clock } = dependencies;
  return {
    ...appointmentCommands(dependencies),
    async agenda(day, days) {
      const range = { startsAt: argentinaInstant(day, 0), endsAt: argentinaInstant(addDays(day, days), 0) };
      const [appointments, blocks] = await Promise.all([repository.listAppointments(range), repository.listBlocks(range)]);
      return { appointments, blocks };
    },
    summary: () => agendaSummary(repository, clock()),
    appointment: (id) => mustFind(repository, id),
    slots: async ({ locationId, day }, scope, ignoreId = null) => (await slotsFor(repository, { locationId, day, scope, now: clock(), ignoreId })).slots,
    createBlock: (input) =>
      repository.inTransaction(async (tx) => {
        if ((await tx.countActiveAppointments(input)) > 0) throw new AppError('BLOCK_HAS_APPOINTMENTS');
        await tx.createBlock(input);
      }),
    deleteBlock: (ref) => repository.deleteBlock(ref),
  };
}

export const agendaService = createAgendaService({ repository: agendaRepository, clock: () => new Date(), sendEmail: emailSenderFromEnv(process.env) });
