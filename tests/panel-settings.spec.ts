import { expect, test } from '@playwright/test';
import { signIn } from './pages/panel';

test.describe('panel: ajustes y ubicaciones', () => {
  test('US-11 y US-12: muestra la duración y suma una obra social', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Cambia datos compartidos: corre en un solo proyecto');
    const name = `Obra E2E ${Date.now()}`;
    await signIn(page);
    await page.goto('/admin/ajustes');
    await expect(page.getByLabel('Minutos por turno')).toHaveValue('45');
    await page.getByRole('form', { name: 'Duración de los turnos' }).getByRole('button', { name: 'Guardar duración' }).click();
    await expect(page.getByRole('status')).toHaveText('Listo: los turnos duran 45 minutos.');
    const add = page.getByRole('form', { name: 'Agregar una obra social' });
    await add.getByLabel('Nueva obra social').fill('Particular');
    await add.getByRole('button', { name: 'Agregar' }).click();
    await expect(add.getByRole('alert')).toHaveText('«Particular» ya está siempre como opción.');
    await add.getByLabel('Nueva obra social').fill(name);
    await add.getByRole('button', { name: 'Agregar' }).click();
    await expect(page.getByRole('list', { name: 'Obras sociales' }).getByRole('textbox', { name: 'Nombre' }).last()).toBeVisible();
    await expect(page.getByRole('form', { name: `Nombre de ${name}` })).toBeVisible();
  });

  test('US-9 y US-10: crea una ubicación, le carga un horario, rechaza uno que se pisa y la desactiva', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Cambia horarios compartidos: corre en un solo proyecto');
    const name = `Consultorio E2E ${Date.now()}`;
    const start = `0${7 + (Date.now() % 3)}:${String((Date.now() % 12) * 5).padStart(2, '0')}`;
    await signIn(page);
    await page.goto('/admin/ubicaciones/nueva');
    await page.getByLabel('Nombre').fill(name);
    await page.getByLabel('Dirección').fill('Calle E2E 456');
    await page.getByRole('button', { name: 'Guardar consultorio' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);

    const hours = page.getByRole('form', { name: 'Agregar una franja' });
    await hours.getByLabel('Día').selectOption({ label: 'domingo' });
    await hours.getByLabel('Desde').fill(start);
    await hours.getByLabel('Hasta').fill('10:30');
    await hours.getByRole('button', { name: 'Agregar franja' }).click();
    await expect(hours.getByRole('status')).toHaveText('Agregamos la franja.');
    await expect(page.getByRole('list', { name: 'Horarios por día' })).toContainText(`${start} a 10:30`);

    await hours.getByLabel('Día').selectOption({ label: 'lunes' });
    await hours.getByLabel('Desde').fill('10:00');
    await hours.getByLabel('Hasta').fill('11:00');
    await hours.getByRole('button', { name: 'Agregar franja' }).click();
    await expect(hours.getByRole('alert')).toHaveText('Ese horario se pisa con otra franja de alguna ubicación. Elegí otro.');

    await page.getByRole('list', { name: 'Horarios por día' }).getByRole('button', { name: 'Borrar' }).click();
    await expect(page.getByRole('list', { name: 'Horarios por día' })).not.toContainText(`${start} a 10:30`);
    await page.getByRole('button', { name: 'Desactivar' }).click();
    await expect(page.getByText('Desactivada: no se ofrece para reservar.')).toBeVisible();
    await page.goto('/admin/ubicaciones');
    await expect(page.getByRole('link', { name: new RegExp(name) })).toContainText('Desactivada');
  });
});
