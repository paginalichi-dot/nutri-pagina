import { fakeAgendaFixture } from './agenda-repository.fake-fixture';
import { agendaPendingReadsBehavior } from './agenda-pending-reads.behavior';
import { agendaRepositoryBehavior } from './agenda-repository.behavior';
import { agendaSummaryReadsBehavior } from './agenda-summary-reads.behavior';

agendaRepositoryBehavior('fake', async () => fakeAgendaFixture());
agendaSummaryReadsBehavior('fake', async () => fakeAgendaFixture());
agendaPendingReadsBehavior('fake', async () => fakeAgendaFixture());
