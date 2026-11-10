import type { PublicLocation } from '@/features/location/domain/public-location.schema';

export const MODALITIES = ['presencial', 'virtual'] as const;
export type Modality = (typeof MODALITIES)[number];
export type StepId = 'ubicacion' | 'dia' | 'hora' | 'confirmar';

type Param = string | string[] | undefined;
export type BookingQuery = Partial<Record<'modalidad' | 'ubicacion' | 'dia' | 'hora' | 'mes' | 'paso', Param>>;
export type Choices = { modalidad: Modality; ubicacion: string; dia: string; hora: string };

export const STEP_LABELS: Readonly<Record<StepId, string>> = { ubicacion: 'Ubicación', dia: 'Día', hora: 'Horario', confirmar: 'Confirmar' };

const BEFORE: Readonly<Record<StepId, readonly (keyof Choices)[]>> = {
  ubicacion: ['modalidad'],
  dia: ['modalidad', 'ubicacion'],
  hora: ['modalidad', 'ubicacion', 'dia'],
  confirmar: ['modalidad', 'ubicacion', 'dia', 'hora'],
};

export const single = (value: Param): string => (typeof value === 'string' ? value : '');

export const modalityOf = (value: Param): Modality | null => MODALITIES.find((modality) => modality === single(value)) ?? null;

export const stepsOf = (modality: Modality): StepId[] => (modality === 'virtual' ? ['dia', 'hora', 'confirmar'] : ['ubicacion', 'dia', 'hora', 'confirmar']);

export function placesFor(locations: readonly PublicLocation[], modality: Modality): PublicLocation[] {
  const kind = modality === 'virtual' ? 'ONLINE' : 'IN_PERSON';
  return locations.filter((location) => location.kind === kind);
}

export function bookingHref(basePath: string, params: Readonly<Record<string, string | undefined>>): string {
  const search = new URLSearchParams(Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1])));
  return search.size > 0 ? `${basePath}?${search}` : basePath;
}

export function hiddenFor(choices: Choices, step: StepId): Record<string, string> {
  return Object.fromEntries(BEFORE[step].filter((key) => choices[key] !== '').map((key) => [key, choices[key]]));
}

export function stepHref(basePath: string, { choices, step }: { choices: Choices; step: StepId }): string {
  const own = step === 'confirmar' ? {} : { [step]: choices[step] };
  return bookingHref(basePath, { ...hiddenFor(choices, step), ...own, paso: step });
}

export function currentStep({ steps, choices, requested }: { steps: readonly StepId[]; choices: Choices; requested: string }): StepId {
  const natural = steps.find((step) => step !== 'confirmar' && choices[step] === '') ?? 'confirmar';
  const asked = steps.find((step) => step === requested);
  return asked && steps.indexOf(asked) < steps.indexOf(natural) ? asked : natural;
}
