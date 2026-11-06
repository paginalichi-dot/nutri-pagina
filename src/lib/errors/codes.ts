const DEFAULT_ENTITY = 'el registro';

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

const CATALOG = {
  VALIDATION: () => 'Revisá los datos ingresados.',
  UNAUTHENTICATED: () => 'Iniciá sesión para continuar.',
  INVALID_CREDENTIALS: () => 'El email o la contraseña no son correctos.',
  SESSION_EXPIRED: () => 'Tu sesión venció. Volvé a iniciar sesión.',
  FORBIDDEN: () => 'No tenés permiso para hacer esto.',
  NOT_FOUND: (entity: string) => `${capitalize(entity)} ya no existe.`,
  DUPLICATE: () => 'Ya existe un registro con esos datos.',
  HAS_RELATIONS: () => 'No se puede borrar porque tiene datos relacionados.',
  RELATION_NOT_FOUND: () => 'Uno de los datos relacionados ya no existe.',
  STALE_VERSION: () => 'Otra persona cambió estos datos. Ya se actualizaron; intentá de nuevo.',
  SLOT_TAKEN: () => 'Ese horario ya no está disponible. Elegí otro.',
  SLOT_TOO_SOON: () => 'Ese horario ya pasó o está demasiado cerca. Elegí otro.',
  INVALID_TOKEN: () => 'El link no es válido o ya venció.',
  RATE_LIMITED: () => 'Hiciste demasiados intentos. Esperá unos minutos y probá de nuevo.',
  UNEXPECTED: (entity: string) => `No se pudo procesar ${entity}. Intentá de nuevo en unos minutos.`,
} satisfies Record<string, (entity: string) => string>;

export type ErrorCode = keyof typeof CATALOG;

export function errorMessage(code: ErrorCode, entity: string = DEFAULT_ENTITY): string {
  return CATALOG[code](entity);
}
