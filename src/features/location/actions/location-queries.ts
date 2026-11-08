import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { z } from 'zod';
import { guardAdminPage } from '@/features/auth/actions/require-admin';
import { isAppError } from '@/lib/errors';
import type { LocationWithHours, PublicLocation } from '../domain/public-location.schema';
import { locationService } from '../services/location.service';
import { LOCATIONS_TAG } from './refresh-locations';

export async function getLocations(): Promise<LocationWithHours[]> {
  await guardAdminPage();
  return locationService.list();
}

export async function getLocation(id: string): Promise<LocationWithHours | null> {
  await guardAdminPage();
  if (!z.uuid().safeParse(id).success) return null;
  try {
    return await locationService.get(id);
  } catch (error) {
    if (isAppError(error) && error.code === 'NOT_FOUND') return null;
    throw error;
  }
}

export async function getPublicLocations(): Promise<PublicLocation[]> {
  'use cache';
  cacheTag(LOCATIONS_TAG);
  cacheLife('days');
  return locationService.listPublic();
}
