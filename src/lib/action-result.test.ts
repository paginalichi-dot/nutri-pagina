import { describe, expect, it } from 'vitest';
import { type ActionResult, fail, failValidation } from './action-result';

describe('ActionResult', () => {
  it('fail arma el caso de error con code y con el mensaje del catálogo', () => {
    expect(fail('SLOT_TAKEN')).toEqual({ success: false, code: 'SLOT_TAKEN', error: 'Ese horario ya no está disponible. Elegí otro.' });
  });

  it('fail usa la entidad en los mensajes que la nombran', () => {
    expect(fail('NOT_FOUND', 'la sucursal')).toEqual({ success: false, code: 'NOT_FOUND', error: 'La sucursal ya no existe.' });
  });

  it('failValidation muestra el mensaje del campo, o el genérico si no hay', () => {
    expect(failValidation('Las contraseñas no coinciden.')).toEqual({ success: false, code: 'VALIDATION', error: 'Las contraseñas no coinciden.' });
    expect(failValidation(undefined)).toEqual({ success: false, code: 'VALIDATION', error: 'Revisá los datos ingresados.' });
  });

  it('el caso de éxito puede llevar datos y mensaje', () => {
    const ok: ActionResult<{ id: string }> = { success: true, data: { id: 'a' }, message: 'Turno reservado' };
    expect(ok.success).toBe(true);
  });
});
