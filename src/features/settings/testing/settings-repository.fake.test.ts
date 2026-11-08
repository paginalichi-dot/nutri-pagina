import { createFakeSettingsRepository } from './settings-repository.fake';
import { settingsRepositoryBehavior } from './settings-repository.behavior';

settingsRepositoryBehavior('fake', async () => createFakeSettingsRepository());
