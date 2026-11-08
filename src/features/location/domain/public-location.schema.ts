import { z } from 'zod';
import { WeeklyHoursRowSchema } from './hours.schema';
import { LOCATION_KINDS, LocationRowSchema } from './location.schema';

export const LocationWithHoursSchema = LocationRowSchema.extend({ hours: z.array(WeeklyHoursRowSchema) });

export const PublicLocationSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  kind: z.enum(LOCATION_KINDS),
  address: z.string().nullable(),
  directions: z.string().nullable(),
  mapUrl: z.string().nullable(),
  hours: z.array(z.object({ weekday: z.int(), startMinute: z.int(), endMinute: z.int() })),
});

export type LocationWithHours = z.infer<typeof LocationWithHoursSchema>;
export type PublicLocation = z.infer<typeof PublicLocationSchema>;
