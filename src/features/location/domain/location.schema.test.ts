import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { LocationInputSchema, locationData, RecordRefSchema } from './location.schema';

const MAP = 'https://www.google.com/maps/embed?pb=!1m18!1m12';
const IN_PERSON = { kind: 'IN_PERSON', name: 'Consultorio Centro', address: 'Calle Falsa 123', directions: '', mapUrl: '' };
const ONLINE = { kind: 'ONLINE', name: 'Online', videoUrl: 'https://meet.example.test/sala' };

function firstMessage(input: unknown): string | undefined {
  const result = LocationInputSchema.safeParse(input);
  return result.success ? undefined : result.error.issues[0]?.message;
}

describe('LocationInputSchema', () => {
  it('acepta una ubicación presencial y deja en null lo opcional vacío', () => {
    expect(LocationInputSchema.parse({ ...IN_PERSON, name: '  Consultorio Centro ' })).toEqual({ ...IN_PERSON, directions: null, mapUrl: null });
  });

  it('del código «Insertar un mapa» guarda sólo la URL del mapa', () => {
    const iframe = `<iframe src="${MAP}&amp;z=1" width="600" height="450"></iframe>`;
    expect(LocationInputSchema.parse({ ...IN_PERSON, mapUrl: iframe })).toMatchObject({ mapUrl: `${MAP}&z=1` });
    expect(LocationInputSchema.parse({ ...IN_PERSON, mapUrl: MAP })).toMatchObject({ mapUrl: MAP });
  });

  it('acepta una ubicación online con su link de videollamada', () => {
    expect(LocationInputSchema.parse(ONLINE)).toEqual(ONLINE);
  });

  it.each([
    [{ ...IN_PERSON, name: ' ' }, 'Ingresá un nombre.'],
    [{ ...IN_PERSON, name: 'x'.repeat(61) }, 'El nombre es demasiado largo (máximo 60 caracteres).'],
    [{ ...IN_PERSON, address: '' }, 'Ingresá la dirección.'],
    [{ ...IN_PERSON, address: 'x'.repeat(121) }, 'La dirección es demasiado larga (máximo 120 caracteres).'],
    [{ ...IN_PERSON, directions: 'x'.repeat(201) }, 'Las indicaciones son demasiado largas (máximo 200 caracteres).'],
    [{ ...IN_PERSON, mapUrl: 'https://maps.app.goo.gl/abc' }, 'Pegá el código de «Insertar un mapa» de Google Maps.'],
    [{ ...IN_PERSON, mapUrl: `${MAP}${'x'.repeat(1000)}` }, 'Pegá el código de «Insertar un mapa» de Google Maps.'],
    [{ ...ONLINE, videoUrl: 'http://meet.example.test/sala' }, 'Ingresá un link que empiece con https://.'],
    [{ ...ONLINE, videoUrl: 'sala' }, 'Ingresá un link que empiece con https://.'],
    [{ ...ONLINE, videoUrl: `https://${'x'.repeat(500)}.test` }, 'El link es demasiado largo.'],
    [{ ...ONLINE, kind: 'OTRA' }, 'Elegí si la ubicación es presencial u online.'],
  ])('rechaza %o con "%s"', (input, message) => {
    expect(firstMessage(input)).toBe(message);
  });

  it('rechaza campos de más', () => {
    expect(LocationInputSchema.safeParse({ ...ONLINE, address: 'Calle 1' }).success).toBe(false);
  });

  it('nunca lanza con entradas arbitrarias', () => {
    fc.assert(fc.property(fc.anything(), (input) => {
      expect(() => LocationInputSchema.safeParse(input)).not.toThrow();
    }));
  });
});

describe('locationData', () => {
  it('una presencial no lleva link de videollamada', () => {
    expect(locationData(LocationInputSchema.parse(IN_PERSON))).toEqual({ kind: 'IN_PERSON', name: 'Consultorio Centro', address: 'Calle Falsa 123', directions: null, mapUrl: null, videoUrl: null });
  });

  it('una online no lleva dirección, indicaciones ni mapa', () => {
    expect(locationData(LocationInputSchema.parse(ONLINE))).toEqual({ kind: 'ONLINE', name: 'Online', videoUrl: 'https://meet.example.test/sala', address: null, directions: null, mapUrl: null });
  });
});

describe('RecordRefSchema', () => {
  it('convierte la versión del formulario en número', () => {
    const id = '7b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10';
    expect(RecordRefSchema.parse({ id, version: '3' })).toEqual({ id, version: 3 });
  });

  it.each([{ id: 'x', version: '1' }, { id: '7b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10', version: '0' }])('rechaza %o', (input) => {
    expect(RecordRefSchema.safeParse(input).error?.issues[0]?.message).toBe('El registro no es válido.');
  });
});
