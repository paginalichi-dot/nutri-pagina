import { randomUUID } from 'node:crypto';
import { AppError } from '@/lib/errors';
import type { AgendaSettingsRow, HealthInsuranceRow } from '../domain/settings.schema';
import type { SettingsRepository } from '../repository/settings.repository';

export function createFakeSettingsRepository(): SettingsRepository {
  let settings: AgendaSettingsRow | null = null;
  const insurances = new Map<string, HealthInsuranceRow>();

  function versioned(id: string, version: number): HealthInsuranceRow {
    const row = insurances.get(id);
    if (!row || row.version !== version) throw new AppError('STALE_VERSION');
    row.version += 1;
    return row;
  }

  function assertUnique(id: string, name: string): void {
    if ([...insurances.values()].some((row) => row.id !== id && row.name.toLowerCase() === name.toLowerCase())) throw new AppError('DUPLICATE');
  }

  return {
    getSettings: async () => (settings ? { ...settings } : null),
    async saveSlotMinutes(slotMinutes, version) {
      if ((settings?.version ?? 0) !== version) throw new AppError('STALE_VERSION');
      settings = { slotMinutes, version: version + 1 };
    },
    listHealthInsurances: async () => [...insurances.values()].sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name)).map((row) => ({ ...row })),
    async createHealthInsurance(name) {
      assertUnique('', name);
      const row = { id: randomUUID(), name, active: true, version: 1 };
      insurances.set(row.id, row);
      return { ...row };
    },
    async renameHealthInsurance({ id, version }, name) {
      assertUnique(id, name);
      versioned(id, version).name = name;
    },
    async setHealthInsuranceActive({ id, version }, active) {
      versioned(id, version).active = active;
    },
  };
}
