import { z } from 'zod';

export { type RecordRef, RecordRefSchema } from '@/lib/record-ref';

export const LOCATION_KINDS = ['IN_PERSON', 'ONLINE'] as const;

const MAP_EMBED = /https:\/\/www\.google\.com\/maps\/embed\?[^"'\s<>]+/;

const NameSchema = z.string().trim().min(1, { error: 'Ingresá un nombre.' }).max(60, { error: 'El nombre es demasiado largo (máximo 60 caracteres).' });

const optionalText = (max: number, error: string): z.ZodType<string | null, unknown> =>
  z
    .string()
    .trim()
    .max(max, { error })
    .transform((value) => (value === '' ? null : value));

const MapUrlSchema = z
  .string()
  .trim()
  .transform((value, context) => {
    if (value === '') return null;
    const url = MAP_EMBED.exec(value.replace(/&amp;/g, '&'))?.[0];
    if (url && url.length <= 1000) return url;
    context.addIssue({ code: 'custom', message: 'Pegá el código de «Insertar un mapa» de Google Maps.' });
    return z.NEVER;
  });

const VideoUrlSchema = z
  .string()
  .trim()
  .max(500, { error: 'El link es demasiado largo.' })
  .pipe(z.url({ protocol: /^https$/, error: 'Ingresá un link que empiece con https://.' }));

export const InPersonLocationInputSchema = z.strictObject({
  kind: z.literal('IN_PERSON'),
  name: NameSchema,
  address: z.string().trim().min(1, { error: 'Ingresá la dirección.' }).max(120, { error: 'La dirección es demasiado larga (máximo 120 caracteres).' }),
  directions: optionalText(200, 'Las indicaciones son demasiado largas (máximo 200 caracteres).'),
  mapUrl: MapUrlSchema,
});

export const OnlineLocationInputSchema = z.strictObject({
  kind: z.literal('ONLINE'),
  name: NameSchema,
  videoUrl: VideoUrlSchema,
});

export const LocationInputSchema = z.discriminatedUnion('kind', [InPersonLocationInputSchema, OnlineLocationInputSchema], {
  error: 'Elegí si la ubicación es presencial u online.',
});

export const LocationRowSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  kind: z.enum(LOCATION_KINDS),
  address: z.string().nullable(),
  directions: z.string().nullable(),
  mapUrl: z.string().nullable(),
  videoUrl: z.string().nullable(),
  active: z.boolean(),
  version: z.int().positive(),
});

export type LocationInput = z.infer<typeof LocationInputSchema>;
export type LocationRow = z.infer<typeof LocationRowSchema>;
export type LocationData = Omit<LocationRow, 'id' | 'active' | 'version'>;

export function locationData(input: LocationInput): LocationData {
  if (input.kind === 'ONLINE') return { kind: 'ONLINE', name: input.name, videoUrl: input.videoUrl, address: null, directions: null, mapUrl: null };
  return { kind: 'IN_PERSON', name: input.name, address: input.address, directions: input.directions, mapUrl: input.mapUrl, videoUrl: null };
}
