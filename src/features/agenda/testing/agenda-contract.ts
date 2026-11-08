import { vi } from 'vitest';
import type { EmailMessage, EmailSender } from '@/lib/email/send-email';
import { CENTRO, ONLINE } from './agenda-builders';
import { fakeAgendaFixture } from './agenda-repository.fake-fixture';
import { createFakeAgendaRepository } from './agenda-repository.fake';

export const fakeAgenda = createFakeAgendaRepository();
export const outbox: EmailMessage[] = [];

export const emailModule = {
  emailSenderFromEnv: (): EmailSender => async (message) => {
    outbox.push(message);
    return true;
  },
};

export async function seedAgenda(): Promise<{ centro: string; online: string }> {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-11-07T12:00:00Z'));
  outbox.length = 0;
  fakeAgenda.reset();
  const fixture = fakeAgendaFixture(fakeAgenda);
  await fixture.setSlotMinutes(45);
  return { centro: await fixture.addPlace(CENTRO), online: await fixture.addPlace(ONLINE) };
}
