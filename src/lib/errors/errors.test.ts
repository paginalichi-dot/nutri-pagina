import { describe, expect, it } from 'vitest';
import { AppError, errorMessage, isAppError } from '.';

describe('catálogo de errores', () => {
  it.each([
    { code: 'VALIDATION', message: 'Revisá los datos ingresados.' },
    { code: 'UNAUTHENTICATED', message: 'Iniciá sesión para continuar.' },
    { code: 'INVALID_CREDENTIALS', message: 'El email o la contraseña no son correctos.' },
    { code: 'WRONG_PASSWORD', message: 'La contraseña actual no es correcta.' },
    { code: 'SESSION_EXPIRED', message: 'Tu sesión venció. Volvé a iniciar sesión.' },
    { code: 'FORBIDDEN', message: 'No tenés permiso para hacer esto.' },
    { code: 'NOT_FOUND', message: 'El turno ya no existe.' },
    { code: 'DUPLICATE', message: 'Ya existe un registro con esos datos.' },
    { code: 'HAS_RELATIONS', message: 'No se puede borrar porque tiene datos relacionados.' },
    { code: 'RELATION_NOT_FOUND', message: 'Uno de los datos relacionados ya no existe.' },
    { code: 'STALE_VERSION', message: 'Otra persona cambió estos datos. Ya se actualizaron; intentá de nuevo.' },
    { code: 'SLOT_TAKEN', message: 'Ese horario ya no está disponible. Elegí otro.' },
    { code: 'SLOT_TOO_SOON', message: 'Ese horario ya pasó o está demasiado cerca. Elegí otro.' },
    { code: 'INVALID_TOKEN', message: 'El link no es válido o ya venció.' },
    { code: 'RATE_LIMITED', message: 'Hiciste demasiados intentos. Esperá unos minutos y probá de nuevo.' },
    { code: 'HOURS_OVERLAP', message: 'Ese horario se pisa con otra franja de alguna ubicación. Elegí otro.' },
    { code: 'HAS_ACTIVE_APPOINTMENTS', message: 'Tiene turnos por venir: cancelalos o reprogramalos primero.' },
    { code: 'BLOCK_HAS_APPOINTMENTS', message: 'En ese rango hay turnos. Cancelalos o reprogramalos antes de bloquear.' },
    { code: 'INVALID_TRANSITION', message: 'Ese cambio no se puede hacer en el estado actual del turno.' },
    { code: 'NO_SLOT_DURATION', message: 'Todavía no definiste la duración de los turnos. Hacelo en Ajustes.' },
    { code: 'UNEXPECTED', message: 'No se pudo procesar el turno. Intentá de nuevo en unos minutos.' },
  ] as const)('$code tiene su mensaje en español', ({ code, message }) => {
    expect(errorMessage(code, 'el turno')).toBe(message);
  });

  it('sin entidad usa "el registro" en los mensajes que la nombran', () => {
    expect(errorMessage('NOT_FOUND')).toBe('El registro ya no existe.');
    expect(errorMessage('UNEXPECTED')).toBe('No se pudo procesar el registro. Intentá de nuevo en unos minutos.');
  });
});

describe('AppError', () => {
  it('lleva el código, el mensaje del catálogo y la causa', () => {
    const cause = new Error('original');
    const error = new AppError('NOT_FOUND', { entity: 'la sucursal', cause });
    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchObject({ name: 'AppError', code: 'NOT_FOUND', message: 'La sucursal ya no existe.', cause });
  });

  it('isAppError distingue un AppError de cualquier otro error', () => {
    expect(isAppError(new AppError('FORBIDDEN'))).toBe(true);
    expect(isAppError(new Error('otro'))).toBe(false);
    expect(isAppError('texto')).toBe(false);
  });
});
