import { z } from 'zod';

export const RecordRefSchema = z.strictObject({
  id: z.uuid({ error: 'El registro no es válido.' }),
  version: z.coerce.number<unknown>().int().positive({ error: 'El registro no es válido.' }),
});

export type RecordRef = z.infer<typeof RecordRefSchema>;
