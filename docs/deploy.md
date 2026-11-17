# Despliegue (Vercel + Supabase)

Pasos para publicar la web (T-11). Los comandos se corren desde la raíz del repo, en la computadora del dev: Vercel no
tiene una terminal. `APP_ENV=production` hace que la app, Prisma y los scripts lean `.env.prod` (ADR 0002).

## 1. Supabase

1. En `.env.prod` (nunca se commitea) van `DATABASE_URL` (pooler, puerto 6543) y `DIRECT_URL` (conexión directa,
   puerto 5432) del proyecto de Supabase.
2. Aplicar las migraciones:

   ```bash
   npx dotenv -v APP_ENV=production -- npm run db:deploy
   ```

3. Crear la cuenta admin de Lisandro. Es el email al que llegan los avisos de solicitudes nuevas. La contraseña debe
   tener al menos 8 caracteres y sólo se guarda su hash:

   ```bash
   npx dotenv -v APP_ENV=production -v ADMIN_EMAIL=lisandroiglopez@gmail.com -v ADMIN_PASSWORD=<contraseña> -- npm run admin:create
   ```

   El mismo comando sirve si Lisandro olvida su contraseña: la reemplaza, desbloquea la cuenta y cierra las sesiones
   abiertas. «¿Olvidaste tu contraseña?» de la web sólo busca pacientes. Desde el panel, «Mi cuenta» la cambia
   sabiendo la actual.

## 2. Gmail (ADR 0008)

En la cuenta de Google de Lisandro: activar la verificación en dos pasos y crear una **contraseña de aplicación**
(Cuenta de Google › Seguridad › Contraseñas de aplicaciones). Esa clave de 16 letras es `GMAIL_APP_PASSWORD`. Nunca
se usa la contraseña de la cuenta.

## 3. Vercel

Importar el repo de GitHub (framework Next.js, rama de producción `main`) y cargar estas variables en *Production*:

| Variable | Valor |
|---|---|
| `APP_ENV` | `production` |
| `DATABASE_URL` | El pooler de Supabase (puerto 6543), igual que en `.env.prod` |
| `DIRECT_URL` | La conexión directa (puerto 5432), igual que en `.env.prod` |
| `JWT_SECRET` | Uno nuevo, distinto del local (cómo generarlo, en `.env.example`) |
| `APP_URL` | La dirección pública, sin barra final (por ejemplo `https://nutri-pagina.vercel.app`) |
| `GMAIL_USER` | `lisandroiglopez@gmail.com` |
| `GMAIL_APP_PASSWORD` | La contraseña de aplicación del paso 2 |
| `EMAIL_FROM` | Opcional: el nombre visible (vacío, «Lisandro López») |
| `LISANDRO_WHATSAPP` | `280 497-8101` |
| `CRON_SECRET` | Uno nuevo, generado como `JWT_SECRET` |

`EMAIL_OUTBOX_DIR` no se carga: en producción la app falla con ella.

## 4. GitHub: el cron de cada hora

`.github/workflows/cron.yml` llama cada hora a `/api/cron/expire-pending`. Cancela las solicitudes que Lisandro no
confirmó cuando faltan 12 h o menos y, como cada llamada consulta la base, Supabase no se pausa por inactividad. En el
repo, *Settings › Secrets and variables › Actions*:

- **Variable** `APP_URL`: la misma de Vercel.
- **Secreto** `CRON_SECRET`: el mismo de Vercel.

Para probarlo sin esperar: *Actions › Cron de solicitudes › Run workflow*. Tiene que responder `{"notified":0}` (o
cuántas canceló). Si falla, GitHub avisa por email.

## 5. Comprobar

- Entrar a `/login` con el admin y ver el panel.
- Registrar una cuenta de paciente con otro email: tiene que llegar el email de activación desde la casilla de
  Lisandro.
- Reservar un turno: a Lisandro le llega el aviso de la solicitud.
