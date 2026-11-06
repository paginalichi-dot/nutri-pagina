import { describe, expect, it, vi } from 'vitest';
import { databaseErrorCode, toActionFailure } from './db-errors';
import { AppError } from './errors';

const prismaError = (code: string): Error => Object.assign(new Error('falló'), { name: 'PrismaClientKnownRequestError', code });

describe('databaseErrorCode', () => {
  it.each([
    ['P2002', 'DUPLICATE'],
    ['P2003', 'RELATION_NOT_FOUND'],
    ['P2025', 'NOT_FOUND'],
    ['P2000', 'VALIDATION'],
    ['P2011', 'VALIDATION'],
  ] as const)('traduce el código de Prisma %s a %s', (code, expected) => {
    expect(databaseErrorCode(prismaError(code))).toBe(expected);
  });

  it.each([
    ['23505', 'DUPLICATE'],
    ['23P01', 'DUPLICATE'],
    ['23503', 'RELATION_NOT_FOUND'],
    ['23514', 'VALIDATION'],
  ] as const)('lee el código de Postgres %s en la causa y lo traduce a %s', (code, expected) => {
    expect(databaseErrorCode(new Error('envoltorio', { cause: { code } }))).toBe(expected);
  });

  it('lee el código que deja el adaptador en meta.driverAdapterError', () => {
    const error = Object.assign(new Error('falló'), { meta: { driverAdapterError: { code: '23505' } } });
    expect(databaseErrorCode(error)).toBe('DUPLICATE');
  });

  it('respeta el código de un AppError', () => {
    expect(databaseErrorCode(new AppError('SLOT_TAKEN'))).toBe('SLOT_TAKEN');
  });

  it.each([[new Error('otro')], ['texto'], [null], [{ code: 42 }]])('devuelve null si no reconoce el error (%s)', (error) => {
    expect(databaseErrorCode(error)).toBeNull();
  });
});

describe('toActionFailure', () => {
  it('devuelve el mensaje del AppError tal cual', () => {
    expect(toActionFailure(new AppError('SLOT_TAKEN'), 'el turno')).toEqual({ success: false, code: 'SLOT_TAKEN', error: 'Ese horario ya no está disponible. Elegí otro.' });
  });

  it('traduce un error conocido de la base con la entidad', () => {
    expect(toActionFailure(prismaError('P2025'), 'el turno')).toEqual({ success: false, code: 'NOT_FOUND', error: 'El turno ya no existe.' });
  });

  it('ante un error desconocido devuelve UNEXPECTED y loguea sólo el nombre y los códigos', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const failure = toActionFailure(new Error('dato personal: ana@example.com'), 'el turno');
    expect(failure).toEqual({ success: false, code: 'UNEXPECTED', error: 'No se pudo procesar el turno. Intentá de nuevo en unos minutos.' });
    expect(JSON.stringify(log.mock.calls)).not.toContain('ana@example.com');
  });
});
