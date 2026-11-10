import type { PublicLocation } from '@/features/location/domain/public-location.schema';
import type { GridSlot } from '../../domain/booking.schema';
import { getBookingDays, getPublicSlots } from '../../actions/booking-queries';
import { type BookingQuery, type Choices, currentStep, type Modality, modalityOf, placesFor, single, type StepId, stepsOf } from './booking-model';

export type BookingSelection = {
  modality: Modality;
  steps: StepId[];
  step: StepId;
  choices: Choices;
  places: PublicLocation[];
  location: PublicLocation | null;
  days: string[];
  month: string;
  slots: GridSlot[];
  time: Date | null;
  error: string | null;
};

type Found = Pick<BookingSelection, 'location' | 'days' | 'slots' | 'time' | 'error'> & { day: string };

async function findChoices(query: BookingQuery, places: readonly PublicLocation[], modality: Modality): Promise<Found> {
  const location = modality === 'virtual' ? (places[0] ?? null) : (places.find(({ id }) => id === single(query.ubicacion)) ?? null);
  const empty: Found = { location, days: [], day: '', slots: [], time: null, error: null };
  if (!location) return empty;
  const { days, error } = await getBookingDays(location.id);
  const day = days.includes(single(query.dia)) ? single(query.dia) : '';
  if (!day) return { ...empty, days, error };
  const { slots, error: slotsError } = await getPublicSlots({ locationId: location.id, day });
  const time = slots.find(({ startsAt, free }) => free && startsAt.toISOString() === single(query.hora))?.startsAt ?? null;
  return { location, days, day, slots, time, error: slotsError };
}

function monthOf(query: BookingQuery, { days, day }: Pick<Found, 'days' | 'day'>): string {
  const months = days.map((date) => date.slice(0, 7));
  return [single(query.mes), day.slice(0, 7)].find((month) => months.includes(month)) ?? months[0] ?? '';
}

export async function resolveSelection(query: BookingQuery, locations: readonly PublicLocation[]): Promise<BookingSelection | null> {
  const modality = modalityOf(query.modalidad);
  if (!modality) return null;
  const places = placesFor(locations, modality);
  const found = await findChoices(query, places, modality);
  const choices: Choices = { modalidad: modality, ubicacion: modality === 'presencial' ? (found.location?.id ?? '') : '', dia: found.day, hora: found.time?.toISOString() ?? '' };
  const steps = stepsOf(modality);
  const step = currentStep({ steps, choices, requested: single(query.paso) });
  return { ...found, modality, steps, step, choices, places, month: monthOf(query, found) };
}
