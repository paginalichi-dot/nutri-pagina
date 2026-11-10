import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { getLocations, getLocationStats } from '@/features/location/actions/location-queries';
import { LocationsScreen } from '@/features/location/ui/components/locations-screen';

export const metadata: Metadata = { title: 'Ubicaciones · Panel' };

export default async function LocationsPage(): Promise<ReactElement> {
  const locations = await getLocations();
  const [first] = locations;
  const selected = first ? { location: first, stats: await getLocationStats(first.id) } : null;
  return <LocationsScreen locations={locations} selected={selected} focus='list' />;
}
