# 0008 — Emails por Gmail (SMTP) en lugar de Resend

- **Estado**: Aceptado (2026-11-17) · Reemplaza el envío por Resend de T-5

## Contexto

Los emails (activar la cuenta, restablecer la contraseña, avisos de turnos) salían por la API de Resend. El dev decidió
no comprar un dominio (2026-11-09), y sin un dominio verificado Resend sólo entrega a la casilla dueña de la cuenta: en
producción no les llegarían a los pacientes.

## Decisión

- Los emails salen por el SMTP de Gmail con `nodemailer` (`src/lib/email/send-email.ts`), autenticados con
  `GMAIL_USER` y `GMAIL_APP_PASSWORD`, una contraseña de aplicación de Google. Las dos viven sólo en el servidor.
- La casilla es la de Lisandro (`lisandroiglopez@gmail.com`, decisión del dev, 2026-11-17): los emails salen de ahí y
  los avisos al admin llegan ahí, porque es también el email de la cuenta admin de producción. Las respuestas de los
  pacientes llegan a la misma casilla.
- `EMAIL_FROM` pasa a ser sólo el nombre visible (vacío: «Lisandro López»). Gmail siempre manda desde `GMAIL_USER`.
- Se mantienen las reglas de T-5: si faltan las credenciales o Gmail falla, el envío devuelve `false` sin lanzar y sólo
  se loguea el código del error, nunca el destinatario ni el contenido. Los E2E siguen con la outbox de archivos.

## Alternativas descartadas

- Resend con dominio propio: pide comprar un dominio.
- Una casilla de Gmail dedicada a la web: era el plan de T-9; el dev eligió la de Lisandro para que todo pase por una
  sola casilla.

## Consecuencias

- Gratis y le llega a cualquier destinatario. Gmail permite unos 500 emails por día, de sobra para un consultorio.
- La contraseña de aplicación da permiso para mandar emails desde la casilla de Lisandro: va sólo en las variables de
  Vercel y en `.env.prod`, nunca en el repo. Si se filtra, se revoca desde la cuenta de Google y se crea otra.
- Si Lisandro cambia la contraseña de Google, las contraseñas de aplicación se revocan y hay que cargar una nueva.
