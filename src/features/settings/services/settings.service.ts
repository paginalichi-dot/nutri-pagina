import type { RecordRef } from '@/lib/record-ref';
import type { AgendaSettingsRow, HealthInsuranceRow, HealthInsuranceUsage, SlotMinutesInput } from '../domain/settings.schema';
import { type SettingsRepository, settingsRepository } from '../repository/settings.repository';

export type SettingsService = {
  getSettings(): Promise<AgendaSettingsRow | null>;
  saveSlotMinutes(input: SlotMinutesInput): Promise<void>;
  listHealthInsurances(): Promise<HealthInsuranceRow[]>;
  listActiveHealthInsurances(): Promise<HealthInsuranceRow[]>;
  listHealthInsuranceUsage(): Promise<HealthInsuranceUsage[]>;
  createHealthInsurance(name: string): Promise<void>;
  renameHealthInsurance(ref: RecordRef, name: string): Promise<void>;
  setHealthInsuranceActive(ref: RecordRef, active: boolean): Promise<void>;
};

export function createSettingsService(repository: SettingsRepository): SettingsService {
  return {
    getSettings: () => repository.getSettings(),
    saveSlotMinutes: ({ slotMinutes, version }) => repository.saveSlotMinutes(slotMinutes, version),
    listHealthInsurances: () => repository.listHealthInsurances(),
    listActiveHealthInsurances: async () => (await repository.listHealthInsurances()).filter(({ active }) => active),
    async listHealthInsuranceUsage() {
      const [rows, counts] = await Promise.all([repository.listHealthInsurances(), repository.appointmentsByHealthInsurance()]);
      return rows.map((row) => ({ ...row, appointments: counts.get(row.id) ?? 0 }));
    },
    createHealthInsurance: async (name) => void (await repository.createHealthInsurance(name)),
    renameHealthInsurance: (ref, name) => repository.renameHealthInsurance(ref, name),
    setHealthInsuranceActive: (ref, active) => repository.setHealthInsuranceActive(ref, active),
  };
}

export const settingsService = createSettingsService(settingsRepository);
