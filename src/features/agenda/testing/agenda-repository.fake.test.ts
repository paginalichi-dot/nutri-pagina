import { fakeAgendaFixture } from './agenda-repository.fake-fixture';
import { agendaRepositoryBehavior } from './agenda-repository.behavior';

agendaRepositoryBehavior('fake', async () => fakeAgendaFixture());
