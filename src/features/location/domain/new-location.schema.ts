import { z } from 'zod';
import { HoursRangeSchema } from './hours.schema';
import { LocationInputSchema } from './location.schema';

export const MAX_NEW_RANGES = 28;

export const NewLocationInputSchema = z.strictObject({
  location: LocationInputSchema,
  active: z.boolean(),
  hours: z.array(HoursRangeSchema).max(MAX_NEW_RANGES, { error: `Cargá como mucho ${MAX_NEW_RANGES} franjas.` }),
});

export type NewLocationInput = z.infer<typeof NewLocationInputSchema>;

export const LocationStatsSchema = z.object({ appointmentsThisMonth: z.int().nonnegative(), blocksThisMonth: z.int().nonnegative() });

export type LocationStats = z.infer<typeof LocationStatsSchema>;
export type Instants = { startsAt: Date; endsAt: Date };
export type MonthActivity = { appointments: number; blocks: Instants[] };
