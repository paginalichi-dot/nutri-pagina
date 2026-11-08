import { db } from '@/lib/db';
import { AppError } from '@/lib/errors';
import type { RecordRef } from '@/lib/record-ref';
import { type AgendaSettingsRow, AgendaSettingsRowSchema, type HealthInsuranceRow, HealthInsuranceRowSchema } from '../domain/settings.schema';

export type SettingsRepository = {
  getSettings(): Promise<AgendaSettingsRow | null>;
  saveSlotMinutes(slotMinutes: number, version: number): Promise<void>;
  listHealthInsurances(): Promise<HealthInsuranceRow[]>;
  createHealthInsurance(name: string): Promise<HealthInsuranceRow>;
  renameHealthInsurance(ref: RecordRef, name: string): Promise<void>;
  setHealthInsuranceActive(ref: RecordRef, active: boolean): Promise<void>;
};

const SETTINGS_ID = 1;
const INSURANCE = { id: true, name: true, active: true, version: true } as const;

function stale(count: number): void {
  if (count === 0) throw new AppError('STALE_VERSION');
}

async function createSettings(slotMinutes: number): Promise<void> {
  try {
    await db.agendaSettings.create({ data: { id: SETTINGS_ID, slotMinutes } });
  } catch (error) {
    throw new AppError('STALE_VERSION', { cause: error });
  }
}

export const settingsRepository: SettingsRepository = {
  async getSettings() {
    const row = await db.agendaSettings.findUnique({ where: { id: SETTINGS_ID }, select: { slotMinutes: true, version: true } });
    return row ? AgendaSettingsRowSchema.parse(row) : null;
  },

  async saveSlotMinutes(slotMinutes, version) {
    if (version === 0) return createSettings(slotMinutes);
    stale((await db.agendaSettings.updateMany({ where: { id: SETTINGS_ID, version }, data: { slotMinutes, version: { increment: 1 } } })).count);
  },

  async listHealthInsurances() {
    const rows = await db.healthInsurance.findMany({ select: INSURANCE, orderBy: [{ active: 'desc' }, { name: 'asc' }] });
    return rows.map((row) => HealthInsuranceRowSchema.parse(row));
  },

  async createHealthInsurance(name) {
    return HealthInsuranceRowSchema.parse(await db.healthInsurance.create({ data: { name }, select: INSURANCE }));
  },

  async renameHealthInsurance({ id, version }, name) {
    stale((await db.healthInsurance.updateMany({ where: { id, version }, data: { name, version: { increment: 1 } } })).count);
  },

  async setHealthInsuranceActive({ id, version }, active) {
    stale((await db.healthInsurance.updateMany({ where: { id, version }, data: { active, version: { increment: 1 } } })).count);
  },
};
