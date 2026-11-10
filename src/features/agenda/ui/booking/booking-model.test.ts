import { describe, expect, it } from 'vitest';
import type { PublicLocation } from '@/features/location/domain/public-location.schema';
import { bookingHref, type Choices, currentStep, hiddenFor, modalityOf, placesFor, stepHref, stepsOf } from './booking-model';

const place = (id: string, kind: PublicLocation['kind']): PublicLocation => ({ id, name: id, kind, address: null, directions: null, mapUrl: null, hours: [] });
const PRESENCIAL: Choices = { modalidad: 'presencial', ubicacion: 'centro', dia: '2026-11-12', hora: '' };

describe('modelo de la reserva (US-40)', () => {
  it('CA-2: presencial tiene 4 pasos y virtual 3, sin Ubicación', () => {
    expect(stepsOf('presencial')).toEqual(['ubicacion', 'dia', 'hora', 'confirmar']);
    expect(stepsOf('virtual')).toEqual(['dia', 'hora', 'confirmar']);
    expect(modalityOf('virtual')).toBe('virtual');
    expect(modalityOf('otra')).toBeNull();
    expect(modalityOf(['presencial'])).toBeNull();
  });

  it('CA-2: cada modalidad ofrece sólo sus ubicaciones', () => {
    const locations = [place('centro', 'IN_PERSON'), place('online', 'ONLINE'), place('norte', 'IN_PERSON')];
    expect(placesFor(locations, 'presencial').map(({ id }) => id)).toEqual(['centro', 'norte']);
    expect(placesFor(locations, 'virtual').map(({ id }) => id)).toEqual(['online']);
  });

  it('CA-3: el paso actual es el primero sin elegir, salvo que se vuelva a uno anterior', () => {
    const steps = stepsOf('presencial');
    expect(currentStep({ steps, choices: PRESENCIAL, requested: '' })).toBe('hora');
    expect(currentStep({ steps, choices: PRESENCIAL, requested: 'ubicacion' })).toBe('ubicacion');
    expect(currentStep({ steps, choices: PRESENCIAL, requested: 'confirmar' })).toBe('hora');
    expect(currentStep({ steps, choices: { ...PRESENCIAL, hora: 'x' }, requested: '' })).toBe('confirmar');
    expect(currentStep({ steps: stepsOf('virtual'), choices: { ...PRESENCIAL, modalidad: 'virtual', ubicacion: '', dia: '' }, requested: '' })).toBe('dia');
  });

  it('CA-3: cada paso lleva como campos ocultos lo elegido antes, y volver a un paso deja marcado lo elegido', () => {
    expect(hiddenFor(PRESENCIAL, 'hora')).toEqual({ modalidad: 'presencial', ubicacion: 'centro', dia: '2026-11-12' });
    expect(hiddenFor({ ...PRESENCIAL, ubicacion: '' }, 'dia')).toEqual({ modalidad: 'presencial' });
    expect(stepHref('/reservar', { choices: PRESENCIAL, step: 'ubicacion' })).toBe('/reservar?modalidad=presencial&ubicacion=centro&paso=ubicacion');
    expect(bookingHref('/reservar', { ubicacion: '' })).toBe('/reservar');
  });
});
