import { describe, expect, it } from 'vitest';
import { formatHours } from './summary-cards';

describe('formatHours', () => {
  it('muestra las horas libres en horas y minutos, como en un reloj', () => {
    expect([450, 405, 600, 0, 45].map(formatHours)).toEqual(['7:30', '6:45', '10:00', '0:00', '0:45']);
  });
});
