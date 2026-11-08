import type { EmailMessage } from '@/lib/email/send-email';
import { type AgendaService, createAgendaService } from '../services/agenda.service';
import { CENTRO, ONLINE } from './agenda-builders';
import { fakeAgendaFixture } from './agenda-repository.fake-fixture';
import type { FakeAgendaRepository } from './agenda-repository.fake';

export const SATURDAY_NOON = new Date('2026-11-07T12:00:00Z');
export const MONDAY = '2026-11-09';
export const MONDAY_9 = new Date('2026-11-09T12:00:00.000Z');

export type AgendaSetup = {
  service: AgendaService;
  repository: FakeAgendaRepository;
  sent: EmailMessage[];
  centro: string;
  online: string;
  insurance: string;
  clock: { now: Date };
  emailWorks: { value: boolean };
};

export async function agendaSetup(): Promise<AgendaSetup> {
  const fixture = fakeAgendaFixture();
  const sent: EmailMessage[] = [];
  const clock = { now: SATURDAY_NOON };
  const emailWorks = { value: true };
  const sendEmail = async (message: EmailMessage): Promise<boolean> => {
    if (emailWorks.value) sent.push(message);
    return emailWorks.value;
  };
  const [centro, online, insurance] = await Promise.all([fixture.addPlace(CENTRO), fixture.addPlace(ONLINE), fixture.addInsurance('Prepaga Uno')]);
  await fixture.setSlotMinutes(45);
  const service = createAgendaService({ repository: fixture.repository, clock: () => clock.now, sendEmail });
  return { service, repository: fixture.repository, sent, centro, online, insurance, clock, emailWorks };
}

export const PATIENT = { name: 'Ana Prueba', phone: '11 2345-6789', email: 'ana@ejemplo.test', healthInsuranceId: null };
