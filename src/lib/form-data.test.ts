import { describe, expect, it } from 'vitest';
import { formFields } from './form-data';

describe('formFields', () => {
  it('toma sólo los campos pedidos y completa con vacío los que faltan', () => {
    const data = new FormData();
    data.set('name', 'Centro');
    data.set('extra', 'x');
    expect(formFields(data, ['name', 'address'])).toEqual({ name: 'Centro', address: '' });
  });
});
