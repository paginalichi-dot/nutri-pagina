import type { DirectoryEntry, PatientFile } from '../domain/patient-directory.schema';
import { type PatientDirectoryRepository, patientDirectoryRepository } from '../repository/patient-directory.repository';
import { buildDirectory, type PatientGroup } from './patient-directory';

export type PatientDirectoryService = {
  list(): Promise<DirectoryEntry[]>;
  file(id: string): Promise<PatientFile | null>;
};

type Dependencies = { repository: PatientDirectoryRepository; clock: () => Date };

export function createPatientDirectoryService({ repository, clock }: Dependencies): PatientDirectoryService {
  async function groups(): Promise<{ list: PatientGroup[]; now: Date }> {
    const [accounts, visits] = await Promise.all([repository.listAccounts(), repository.listVisits()]);
    const now = clock();
    return { list: buildDirectory(accounts, visits, now), now };
  }

  return {
    list: async () => (await groups()).list.map(({ entry }) => entry),
    async file(id) {
      const { list, now } = await groups();
      const group = list.find(({ entry, visits }) => entry.id === id || visits.some((visit) => visit.id === id));
      if (!group) return null;
      const upcoming = group.visits.filter((visit) => visit.startsAt >= now);
      const past = group.visits.filter((visit) => visit.startsAt < now).reverse();
      return { entry: group.entry, upcoming, past };
    },
  };
}

export const patientDirectoryService = createPatientDirectoryService({ repository: patientDirectoryRepository, clock: () => new Date() });
