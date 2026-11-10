const DEFAULT_ENTITY = 'el registro';

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

const CATALOG = {
  VALIDATION: () => 'Revisá los datos ingresados.',
  UNAUTHENTICATED: () => 'Iniciá sesión para continuar.',
  INVALID_CREDENTIALS: () => 'El email o la contraseña no son correctos.',
  WRONG_PASSWORD: () => 'La contraseña actual no es correcta.',
  EMAIL_NOT_VERIFIED: () => 'Activá tu cuenta con el link que te mandamos.',
  EMAIL_IN_USE: () => 'Ese email ya lo usa otra cuenta.',
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
  HOURS_OVERLAP: () => 'Ese horario se pisa con otra franja de alguna ubicación. Elegí otro.',
  HAS_ACTIVE_APPOINTMENTS: () => 'Tiene turnos por venir: cancelalos o reprogramalos primero.',
  BLOCK_HAS_APPOINTMENTS: () => 'En ese rango hay turnos. Cancelalos o reprogramalos antes de bloquear.',
  INVALID_TRANSITION: () => 'Ese cambio no se puede hacer en el estado actual del turno.',
  NO_SLOT_DURATION: () => 'Todavía no definiste la duración de los turnos. Hacelo en Ajustes.',
  BOOKING_LIMIT: () => 'Ya tenés dos turnos por venir. Cancelá o reprogramá uno para reservar otro.',
  CHANGE_TOO_LATE: () => 'Faltan menos de 24 h para tu turno. Escribile a Lisandro para cambiarlo.',
  UNEXPECTED: (entity: string) => `No se pudo procesar ${entity}. Intentá de nuevo en unos minutos.`,
} satisfies Record<string, (entity: string) => string>;

export type ErrorCode = keyof typeof CATALOG;

export function errorMessage(code: ErrorCode, entity: string = DEFAULT_ENTITY): string {
  return CATALOG[code](entity);
}
