import { type ErrorCode, errorMessage } from './errors';

export type ActionFailure = { success: false; error: string; code?: ErrorCode };

export type ActionResult<T = void> = (T extends void ? { success: true; data?: T; message?: string } : { success: true; data: T; message?: string }) | ActionFailure;

export function fail(code: ErrorCode, entity?: string): ActionFailure {
  return { success: false, code, error: errorMessage(code, entity) };
}

export function failValidation(message: string | undefined): ActionFailure {
  return { success: false, code: 'VALIDATION', error: message ?? errorMessage('VALIDATION') };
}
