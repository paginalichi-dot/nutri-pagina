import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { guardAdminPage } from '@/features/auth/actions/require-admin';
import type { AgendaSettingsRow, HealthInsuranceRow, HealthInsuranceUsage } from '../domain/settings.schema';
import { settingsService } from '../services/settings.service';
import { HEALTH_INSURANCES_TAG } from './settings-tags';

export type SettingsOverview = { settings: AgendaSettingsRow | null; healthInsurances: HealthInsuranceUsage[] };

export async function getSettingsOverview(): Promise<SettingsOverview> {
  await guardAdminPage();
  const [settings, healthInsurances] = await Promise.all([settingsService.getSettings(), settingsService.listHealthInsuranceUsage()]);
  return { settings, healthInsurances };
}

export async function getActiveHealthInsurances(): Promise<HealthInsuranceRow[]> {
  'use cache';
  cacheTag(HEALTH_INSURANCES_TAG);
  cacheLife('days');
  return settingsService.listActiveHealthInsurances();
}
