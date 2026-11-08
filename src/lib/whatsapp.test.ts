import { describe, expect, it } from 'vitest';
import { whatsappLink, whatsappNumber } from './whatsapp';

describe('whatsappNumber', () => {
  it.each([
    ['11 2345-6789', '5491123456789'],
    ['011 2345 6789', '5491123456789'],
    ['+54 9 11 2345-6789', '5491123456789'],
    ['(0351) 456-7890', '5493514567890'],
  ])('%s se manda a %s', (phone, number) => {
    expect(whatsappNumber(phone)).toBe(number);
  });
});

describe('whatsappLink', () => {
  it('arma el link de wa.me con el mensaje codificado', () => {
    expect(whatsappLink('11 2345-6789', 'Hola Ana: tu turno del lunes 9/11 a las 10:00 se canceló.')).toBe(
      'https://wa.me/5491123456789?text=Hola%20Ana%3A%20tu%20turno%20del%20lunes%209%2F11%20a%20las%2010%3A00%20se%20cancel%C3%B3.'
    );
  });
});
