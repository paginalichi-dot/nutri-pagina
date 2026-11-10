import { createFakeLocationRepository } from './location-repository.fake';
import { locationHoursBehavior } from './location-hours.behavior';
import { locationRepositoryBehavior } from './location-repository.behavior';

locationRepositoryBehavior('fake', async () => createFakeLocationRepository());
locationHoursBehavior('fake', async () => createFakeLocationRepository());
