import { createFakeLocationRepository } from './location-repository.fake';
import { locationRepositoryBehavior } from './location-repository.behavior';

locationRepositoryBehavior('fake', async () => createFakeLocationRepository());
