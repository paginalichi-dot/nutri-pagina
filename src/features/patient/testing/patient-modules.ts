import { createFakePatientStore, type FakePatientStore } from './patient-store.fake';

export const sharedStore: FakePatientStore = createFakePatientStore();

export async function fakePatientRepositoryModule(): Promise<Record<string, unknown>> {
  return { patientRepository: sharedStore.patients };
}

export async function fakePatientTokenModule(): Promise<Record<string, unknown>> {
  return { patientTokenRepository: sharedStore.links };
}

export function resetSharedStore(): void {
  sharedStore.rows.clear();
  sharedStore.tokens.length = 0;
}
