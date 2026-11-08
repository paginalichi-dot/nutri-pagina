import { expect, test } from '@playwright/test';
import { signIn, weekdayFromToday } from './pages/panel';

test.describe('panel: agenda y turnos', () => {
  test('US-13 a US-18: carga un turno a mano, lo ve en la agenda, lo reprograma y lo cancela', async ({ page }, testInfo) => {
    const day = weekdayFromToday(testInfo.project.name === 'chromium' ? 8 : 10);
    const patient = `Paciente E2E ${testInfo.project.name} ${Date.now()}`;
    await signIn(page);
    await page.getByRole('link', { name: 'Nuevo turno' }).click();
    const query = page.getByRole('form', { name: 'Elegir ubicación y día' });
    await query.getByLabel('Ubicación').selectOption({ label: 'Consultorio de ejemplo' });
    await query.getByLabel('Día').fill(day);
    await query.getByRole('button', { name: 'Ver horarios' }).click();

    const form = page.getByRole('form', { name: 'Datos del turno' });
    await form.getByLabel('Nombre y apellido').fill(patient);
    await form.getByLabel('Teléfono (WhatsApp)').fill('11 2345-6789');
    await form.getByLabel('Obra social').selectOption({ label: 'Prepaga Ficticia' });
    await form.getByRole('button', { name: 'Guardar turno' }).click();
    const done = page.getByRole('status');
    await expect(done).toContainText('Turno guardado para el');
    await expect(done).toContainText('No tiene email: avisale por WhatsApp.');
    await expect(done.getByRole('link', { name: 'Avisar por WhatsApp' })).toHaveAttribute('href', /^https:\/\/wa\.me\/5491123456789\?text=/);

    await page.goto(`/admin?dia=${day}`);
    await page.getByRole('link', { name: new RegExp(patient) }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`Turno de ${patient}`);
    await expect(page.getByText('Prepaga Ficticia', { exact: true })).toBeVisible();

    await page.getByRole('link', { name: 'Reprogramar' }).click();
    const reschedule = page.getByRole('form', { name: 'Nuevo horario' });
    await reschedule.locator('label').last().click();
    await expect(reschedule.getByRole('radio').last()).toBeChecked();
    await reschedule.getByRole('button', { name: 'Reprogramar' }).click();
    await expect(page.getByRole('status')).toContainText('Turno movido al');
    await page.getByRole('link', { name: 'Ver el turno' }).click();

    page.once('dialog', (dialog) => void dialog.accept());
    await page.getByRole('button', { name: 'Cancelar turno' }).click();
    await expect(page.getByRole('status')).toContainText('Turno cancelado.');
    await page.reload();
    await expect(page.getByText('Cancelado', { exact: true })).toBeVisible();
  });

  test('US-14: bloquea un horario y lo borra', async ({ page }, testInfo) => {
    const offset = testInfo.project.name === 'chromium' ? 40 : 41;
    const day = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date(Date.now() + offset * 86_400_000));
    await signIn(page);
    await page.getByRole('link', { name: 'Bloquear horario' }).click();
    const form = page.getByRole('form', { name: 'Bloquear un horario' });
    await form.getByLabel('Desde').fill(`${day}T05:00`);
    await form.getByLabel('Hasta').fill(`${day}T06:00`);
    await form.getByLabel('Motivo (opcional, sólo lo ves vos)').fill(`Trámite E2E ${testInfo.project.name}`);
    await form.getByRole('button', { name: 'Bloquear' }).click();
    await expect(form.getByRole('status')).toHaveText('Bloqueo guardado: en ese rango no se ofrecen turnos.');
    const item = page.getByRole('listitem').filter({ hasText: `Trámite E2E ${testInfo.project.name}` });
    await item.getByRole('button', { name: 'Borrar' }).click();
    await expect(item).toHaveCount(0);
  });
});
