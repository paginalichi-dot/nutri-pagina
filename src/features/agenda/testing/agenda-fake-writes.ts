import { randomUUID } from 'node:crypto';
import { AppError } from '@/lib/errors';
import type { TimeRange } from '../domain/appointment.schema';
import type { BlockRow } from '../domain/block.schema';
import type { AgendaRepository, NewAppointment } from '../repository/agenda.repository';
import type { FakePlace } from './agenda-repository.fake';

export type Stored = NewAppointment & { id: string; version: number };

export type FakeState = {
  places: Map<string, FakePlace>;
  insurances: Map<string, string>;
  settings: { slotMinutes: number | null };
  appointments: Map<string, Stored>;
  blocks: Map<string, BlockRow>;
};

const overlaps = (a: TimeRange, b: TimeRange): boolean => a.startsAt < b.endsAt && b.startsAt < a.endsAt;

function versioned<T extends { version: number }>(row: T | undefined, version: number): T {
  if (!row || row.version !== version) throw new AppError('STALE_VERSION');
  row.version += 1;
  return row;
}

export function fakeAppointmentWrites(state: FakeState): Pick<AgendaRepository, 'createAppointment' | 'updateStatus' | 'moveAppointment' | 'createBlock' | 'deleteBlock'> {
  function assertFree(range: TimeRange, ignoreId: string | null): void {
    const taken = [...state.appointments.values()].some((row) => row.status !== 'CANCELLED' && row.id !== ignoreId && overlaps(row, range));
    if (taken) throw new AppError('SLOT_TAKEN');
  }

  return {
    async createAppointment(data) {
      if (!state.places.has(data.locationId)) throw new AppError('RELATION_NOT_FOUND');
      assertFree(data, null);
      const id = randomUUID();
      state.appointments.set(id, { ...data, id, version: 1 });
      return id;
    },
    async updateStatus({ id, version }, status) {
      versioned(state.appointments.get(id), version).status = status;
    },
    async moveAppointment({ id, version }, move) {
      assertFree(move, id);
      Object.assign(versioned(state.appointments.get(id), version), move);
    },
    async createBlock(data) {
      const id = randomUUID();
      state.blocks.set(id, { ...data, id, version: 1 });
    },
    async deleteBlock({ id, version }) {
      versioned(state.blocks.get(id), version);
      state.blocks.delete(id);
    },
  };
}
