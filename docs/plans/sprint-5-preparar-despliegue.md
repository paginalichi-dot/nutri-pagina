# T-9 y T-11 · Preparar el despliegue

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md#sprint-5--despliegue) (T-9 y T-11)
- **Nivel de tests**: 2 · Lógica acotada
- **Estado del plan**: Aprobado (2026-11-17)

## Objetivo

Antes de desplegar, la web deja de tener datos de ejemplo: los emails salen y llegan a la casilla real de Lisandro,
el footer muestra sus contactos reales, existe una forma segura de crear el admin de producción y una acción
programada mantiene viva la base de Supabase.

## Descubrimiento (dev, 2026-11-17)

- Email de Lisandro: `lisandroiglopez@gmail.com`. Los emails **salen** de esa casilla y **llegan** a ella (es el email
  del admin de producción, al que van los avisos de solicitudes nuevas).
- WhatsApp: +54 9 280 497-8101. Instagram: `https://www.instagram.com/nutri.lopez/`.
- Supabase gratis se pausa tras 7 días sin uso. Se elige una **GitHub Action cada hora** que llama a
  `/api/cron/expire-pending`: cancela los turnos que Lisandro no confirmó cuando faltan 12 h o menos y, como consulta
  la base en cada corrida, mantiene despierta a Supabase. Un cron diario de Vercel cancelaría tarde o nunca.
- El admin de producción se crea con un script, `npm run admin:create`, corrido desde la computadora del dev contra
  `.env.prod` (Vercel no tiene terminal). Sirve también si Lisandro olvida su contraseña: «¿Olvidaste tu contraseña?»
  sólo busca pacientes.

## Cambios

| Ítem | Archivos | Cambio |
|---|---|---|
| T-9 | `src/lib/email/send-email.ts`, `.env.example`, ADR 0008 | Gmail por SMTP con `nodemailer` (`GMAIL_USER`, `GMAIL_APP_PASSWORD`; `EMAIL_FROM` = nombre visible). Sale Resend. |
| T-11 | `src/components/home/site-footer.tsx`, `src/app/privacidad/sections.ts` | Contactos reales en `CONTACTS` y el email de contacto de la política de privacidad. |
| T-11 | `src/features/auth/services/create-admin.ts`, `prisma/create-admin.ts`, `package.json` | `npm run admin:create`: valida `ADMIN_EMAIL` y `ADMIN_PASSWORD` con Zod y crea o actualiza el admin con la contraseña hasheada. |
| T-11 | `.github/workflows/cron.yml` | Cada hora (y a mano), `GET $APP_URL/api/cron/expire-pending` con `Authorization: Bearer $CRON_SECRET`; falla si no responde 200. |
| T-11 | `docs/deploy.md` | Pasos del despliegue: variables de Vercel, secretos de GitHub, migraciones y admin. |

Sin cambios de schema.

## Errores

| Situación | Resultado |
|---|---|
| Faltan `GMAIL_USER` o `GMAIL_APP_PASSWORD`, o Gmail falla | El envío devuelve `false`; se loguea sólo el motivo o el código de error. |
| `admin:create` sin email válido o con contraseña de menos de 8 caracteres (la misma regla que «Mi cuenta») | Termina con el mensaje del error, sin tocar la base. |
| El cron sin el secreto | 401 (ya existía). La acción falla y GitHub avisa por email. |

## Tests

| Tipo | Qué prueba |
|---|---|
| Unit | El remitente de Gmail: mensaje y adjunto en base64, credenciales faltantes, errores sin datos del paciente. |
| Unit | `createAdmin`: valida la entrada, guarda el hash (nunca la contraseña) y normaliza el email. |
| Componente | El footer con los contactos reales y la política con el email de contacto. |

## Riesgos

- La contraseña de aplicación da acceso para mandar desde la casilla personal de Lisandro: sólo va en Vercel y en
  `.env.prod`.
- GitHub puede atrasar unos minutos las acciones programadas y las desactiva en repos públicos sin actividad por 60
  días: GitHub avisa por email y se reactivan con un clic.
- En un repo privado, la acción usa unos 720 de los 2000 minutos gratis por mes de GitHub Actions, junto con el CI.
