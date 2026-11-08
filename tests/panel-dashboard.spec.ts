import { expect, test } from '@playwright/test';
import { signIn, weekdayFromToday } from './pages/panel';

test.describe('panel: tablero de la agenda (US-26) y confirmar (US-23)', () => {
  test('muestra el saludo, el resumen, el próximo turno y el calendario, que lleva a otro mes', async ({ page }) => {
    await signIn(page);
    await expect(page.getByText(/^(Buen día|Buenas tardes|Buenas noches), Lisandro$/)).toBeVisible();
    const summary = page.getByRole('list', { name: 'Resumen' });
    for (const label of ['Turnos hoy', 'Esta semana', 'Pacientes nuevos', 'Horas libres hoy']) await expect(summary.getByText(label, { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Próximo turno' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver el detalle del próximo turno' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Bloquear horario' })).toBeVisible();
    await page.getByRole('link', { name: 'Mes siguiente' }).click();
    await expect(page).toHaveURL(/dia=\d{4}-\d{2}-01/);
  });

  test('US-26 CA-9: «Semana» sólo cambia la grilla; la agenda y el próximo turno quedan en su lugar', async ({ page }) => {
    await signIn(page);
    await page.goto(`/admin?dia=${weekdayFromToday(3)}&vista=dia`);
    const board = page.getByRole('region', { name: 'Agenda' });
    const next = page.getByRole('heading', { name: 'Próximo turno' });
    const place = async (): Promise<unknown[]> => (await Promise.all([board.boundingBox(), next.boundingBox()])).map((box) => ({ x: box?.x, y: box?.y, width: box?.width }));
    const before = await place();
    await board.getByRole('link', { name: 'Semana' }).click();
    await expect(page).toHaveURL(/vista=semana/);
    await expect(board.getByRole('table')).toBeVisible();
    expect(await place()).toEqual(before);
    await expect(board.getByRole('link', { name: /Paciente pendiente/ }).first()).toBeVisible();
  });

  test('US-26 CA-11: con el mouse encima, cada control se funde en degradé hacia un tono más oscuro', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'En el celular no hay mouse');
    await signIn(page);
    const shade = (element: Element): string[] => [getComputedStyle(element, '::before').opacity, getComputedStyle(element, '::before').backgroundImage.slice(0, 15)];
    const nav = page.getByRole('navigation', { name: 'Panel' });
    const board = page.getByRole('region', { name: 'Agenda' });
    for (const control of [page.getByRole('link', { name: 'Nuevo turno' }), page.getByRole('link', { name: 'Bloquear horario' }), board.getByRole('link', { name: 'Hoy', exact: true }), board.getByRole('link', { name: 'Semana' }), page.getByRole('link', { name: 'Mes siguiente' }), nav.getByRole('link', { name: 'Ubicaciones' })]) {
      expect(await control.evaluate(shade)).toEqual(['0', 'linear-gradient']);
      await control.hover();
      await expect.poll(() => control.evaluate(shade)).toEqual(['1', 'linear-gradient']);
    }
  });

  test('US-23: confirma un turno pendiente desde su detalle', async ({ page }, testInfo) => {
    const patient = testInfo.project.name === 'chromium' ? 'Paciente pendiente 1' : 'Paciente pendiente 2';
    await signIn(page);
    await page.goto(`/admin?dia=${weekdayFromToday(3)}`);
    await page.getByRole('link', { name: new RegExp(patient) }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`Turno de ${patient}`);
    await page.getByRole('button', { name: 'Confirmar' }).click();
    await expect(page.getByRole('status')).toContainText('Turno confirmado.');
    await page.reload();
    await expect(page.getByText('Confirmado', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirmar' })).toHaveCount(0);
  });

  test('«Pacientes» muestra que llega más adelante', async ({ page }) => {
    await signIn(page);
    await page.getByRole('navigation', { name: 'Panel' }).getByRole('link', { name: 'Pacientes' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pacientes');
    await expect(page.getByRole('heading', { name: 'Próximamente' })).toBeVisible();
  });
});
