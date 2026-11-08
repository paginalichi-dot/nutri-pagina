import 'server-only';
import { revalidatePath, updateTag } from 'next/cache';

export const LOCATIONS_TAG = 'locations';

export function refreshLocations(): void {
  updateTag(LOCATIONS_TAG);
  revalidatePath('/admin', 'layout');
}
