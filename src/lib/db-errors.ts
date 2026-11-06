import type { ActionFailure } from './action-result';
import { AppError, type ErrorCode, errorMessage } from './errors';

const UNIQUE = ['P2002', '23505', '23P01'];
const FOREIGN_KEY = ['P2003', '23503'];
const NOT_FOUND = ['P2025'];
const INVALID_DATA = ['P2000', 'P2006', 'P2007', 'P2011', 'P2012', '23502', '23514', '22P02', '22001', '22003'];

function property(source: unknown, key: string): unknown {
  return typeof source === 'object' && source !== null ? Reflect.get(source, key) : undefined;
}

function codesOf(error: unknown): string[] {
  const sources = [error, property(error, 'cause'), property(property(error, 'meta'), 'driverAdapterError')];
  return sources.map((source) => property(source, 'code')).filter((code): code is string => typeof code === 'string');
}

export function databaseErrorCode(error: unknown): ErrorCode | null {
  if (error instanceof AppError) return error.code;
  const codes = codesOf(error);
  const has = (list: string[]): boolean => codes.some((code) => list.includes(code));
  if (has(UNIQUE)) return 'DUPLICATE';
  if (has(FOREIGN_KEY)) return 'RELATION_NOT_FOUND';
  if (has(NOT_FOUND)) return 'NOT_FOUND';
  if (has(INVALID_DATA)) return 'VALIDATION';
  return null;
}

function logUnexpected(error: unknown): void {
  console.error('Error inesperado de la base:', { name: property(error, 'name'), codes: codesOf(error) });
}

export function toActionFailure(error: unknown, entityName: string): ActionFailure {
  if (error instanceof AppError) return { success: false, code: error.code, error: error.message };
  const known = databaseErrorCode(error);
  if (known === null) logUnexpected(error);
  const code = known ?? 'UNEXPECTED';
  return { success: false, code, error: errorMessage(code, entityName) };
}
