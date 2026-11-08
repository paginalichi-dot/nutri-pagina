import { randomUUID } from 'node:crypto';
import { type AgendaFixture, PLACE_DATA } from './agenda-builders';
import { createFakeAgendaRepository, type FakeAgendaRepository } from './agenda-repository.fake';

export function fakeAgendaFixture(repository: FakeAgendaRepository = createFakeAgendaRepository()): AgendaFixture & { repository: FakeAgendaRepository } {
  return {
    repository,
    async addPlace({ name, kind, hours, active = true }) {
      const id = randomUUID();
      repository.places.set(id, { id, name, kind, active, hours, ...PLACE_DATA[kind] });
      return id;
    },
    async addInsurance(name) {
      const id = randomUUID();
      repository.insurances.set(id, name);
      return id;
    },
    async setSlotMinutes(minutes) {
      repository.settings.slotMinutes = minutes;
    },
  };
}
