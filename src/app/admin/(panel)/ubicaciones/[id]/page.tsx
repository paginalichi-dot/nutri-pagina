import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { getLocations, getLocationStats } from '@/features/location/actions/location-queries';
import { LocationsScreen } from '@/features/location/ui/components/locations-screen';

export const metadata: Metadata = { title: 'Ubicación · Panel' };

export default async function LocationPage({ params }: PageProps<'/admin/ubicaciones/[id]'>): Promise<ReactElement> {
  const { id } = await params;
  const locations = await getLocations();
  const location = locations.find((row) => row.id === id);
  if (!location) notFound();
  return <LocationsScreen locations={locations} selected={{ location, stats: await getLocationStats(location.id) }} focus='detail' />;
}
