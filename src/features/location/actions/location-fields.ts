import { formFields } from '@/lib/form-data';

const FIELDS = {
  IN_PERSON: ['kind', 'name', 'address', 'directions', 'mapUrl'],
  ONLINE: ['kind', 'name', 'videoUrl'],
} as const;

export function locationFields(formData: FormData): Record<string, FormDataEntryValue> {
  return formFields(formData, formData.get('kind') === 'ONLINE' ? FIELDS.ONLINE : FIELDS.IN_PERSON);
}

export function newLocationFields(formData: FormData): Record<string, unknown> {
  const [weekdays, starts, ends] = (['weekday', 'start', 'end'] as const).map((name) => formData.getAll(name));
  return {
    location: locationFields(formData),
    active: formData.get('active') === 'true',
    hours: (weekdays ?? []).map((weekday, index) => ({ weekday, start: starts?.[index] ?? '', end: ends?.[index] ?? '' })),
  };
}
