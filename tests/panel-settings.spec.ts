import { expect, test } from '@playwright/test';
import { signIn } from './pages/panel';

test.describe('panel: ajustes y ubicaciones', () => {
  test('US-44: duración con opciones y obras sociales con interruptor, en pestañas', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Cambia datos compartidos: corre en un solo proyecto');
    const name = `Obra E2E ${Date.now()}`;
    await signIn(page);
    await page.goto('/admin/ajustes');
    await expect(page.getByLabel('Minutos por turno')).toHaveValue('45');
    await expect(page.getByRole('button', { name: '45 minutos' })).toHaveAttribute('aria-pressed', 'true');
    await page.getByLabel('Minutos por turno').fill('0');
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    await expect(page.getByRole('form', { name: 'Duración de los turnos' }).getByRole('alert')).toHaveText('Ingresá los minutos como un número entero mayor que 0.');
    await page.getByRole('button', { name: '45 minutos' }).click();
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    await expect(page.getByRole('status')).toHaveText('Listo: los turnos duran 45 minutos.');

    await page.getByRole('link', { name: 'Obras sociales' }).click();
    await expect(page).toHaveURL(/pestana=obras-sociales/);
    await page.getByRole('button', { name: 'Nueva obra social' }).click();
    const add = page.getByRole('form', { name: 'Agregar una obra social' });
    await add.getByLabel('Nueva obra social').fill('Particular');
    await add.getByRole('button', { name: 'Agregar' }).click();
    await expect(add.getByRole('alert')).toHaveText('«Particular» ya está siempre como opción.');
    await add.getByLabel('Nueva obra social').fill(name);
    await add.getByRole('button', { name: 'Agregar' }).click();
    const toggle = page.getByRole('switch', { name: `Ofrecer ${name}` });
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByRole('list', { name: 'Obras sociales' }).getByRole('listitem').filter({ hasText: name })).toContainText('0 turnos');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  test('US-41 y US-42: crea una ubicación con dos franjas, edita una, rechaza una que se pisa, las borra y la desactiva', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Cambia horarios compartidos: corre en un solo proyecto');
    const name = `Consultorio E2E ${Date.now()}`;
    const start = `0${7 + (Date.now() % 3)}:${String((Date.now() % 12) * 5).padStart(2, '0')}`;
    await signIn(page);
    await page.goto('/admin/ubicaciones');
    await page.getByRole('link', { name: 'Nueva ubicación' }).click();
    await page.getByLabel('Nombre').fill(name);
    await page.getByLabel('Dirección').fill('Calle E2E 456');
    await expect(page.getByRole('complementary', { name: 'Vista del paciente' })).toContainText(name);
    await page.getByRole('switch', { name: 'Atendés los domingos' }).check();
    await page.getByLabel('Desde, domingo').fill(start);
    await page.getByLabel('Hasta, domingo').fill('10:30');
    await page.getByRole('button', { name: 'Franja' }).click();
    await page.getByLabel('Desde, domingo').nth(1).fill('11:00');
    await page.getByLabel('Hasta, domingo').nth(1).fill('11:30');
    await page.getByRole('button', { name: 'Guardar consultorio' }).click();

    const detail = page.getByRole('article');
    await expect(detail.getByRole('heading', { level: 2 })).toHaveText(name);
    const hours = detail.getByRole('list', { name: 'Horarios por día' });
    await expect(hours).toContainText(`${start} – 10:30`);
    await hours.getByRole('button', { name: 'Editar la franja del domingo de 11:00 – 11:30' }).click();
    await page.getByRole('form', { name: 'Editar la franja' }).getByLabel('Hasta').fill('12:00');
    await page.getByRole('form', { name: 'Editar la franja' }).getByRole('button', { name: 'Guardar' }).click();
    await expect(hours).toContainText('11:00 – 12:00');

    await detail.getByRole('button', { name: 'Agregar horario' }).click();
    const add = page.getByRole('form', { name: 'Agregar una franja' });
    await add.getByLabel('Día').selectOption({ label: 'domingo' });
    await add.getByLabel('Desde').fill('10:00');
    await add.getByLabel('Hasta').fill('11:30');
    await add.getByRole('button', { name: 'Agregar franja' }).click();
    await expect(add.getByRole('alert')).toHaveText('Ese horario se pisa con otra franja de alguna ubicación. Elegí otro.');

    await hours.getByRole('button', { name: 'Borrar la franja del domingo de 11:00 – 12:00' }).click();
    await hours.getByRole('button', { name: `Borrar la franja del domingo de ${start} – 10:30` }).click();
    await expect(hours.getByText('sin atención')).toHaveCount(7);
    page.once('dialog', (dialog) => void dialog.accept());
    await detail.getByRole('button', { name: 'Desactivar ubicación' }).click();
    await expect(detail.getByRole('button', { name: 'Reactivar ubicación' })).toBeVisible();
    await expect(page.getByRole('list', { name: 'Ubicaciones' }).getByRole('link', { name: new RegExp(name) })).toContainText('Desactivada');
  });
});
