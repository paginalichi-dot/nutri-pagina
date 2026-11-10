import { expect, type Locator, type Page } from '@playwright/test';

const WEEKDAY = /^(lunes|martes|miércoles|jueves|viernes|sábado|domingo), /;
const TIME = /^\d{2}:\d{2}$/;

export const projectOffset = (project: string): number => (project === 'chromium' ? 1 : 2);

type Modality = 'presencial' | 'virtual';
export type Choice = { modality: Modality; location?: string; dayIndex: number; timeFromEnd: number };

const continueStep = (page: Page): Promise<void> => page.getByRole('button', { name: 'Continuar' }).click();

export const pick = (radio: Locator): Promise<void> => radio.locator('xpath=..').click();

async function pickDay(page: Page, dayIndex: number): Promise<void> {
  await expect(page.getByRole('heading', { name: '¿Qué día te queda bien?' })).toBeVisible();
  const days = page.getByRole('radio', { name: WEEKDAY });
  const count = await days.count();
  if (dayIndex >= count) {
    await page.getByRole('link', { name: 'Mes siguiente' }).click();
    return pickDay(page, dayIndex - count);
  }
  await pick(days.nth(dayIndex));
  await continueStep(page);
}

export async function chooseSlot(page: Page, { modality, location, dayIndex, timeFromEnd }: Choice): Promise<void> {
  await page.getByRole('link', { name: modality === 'virtual' ? /Elegir virtual/ : /Elegir presencial/ }).click();
  if (modality === 'presencial') {
    await expect(page.getByRole('heading', { name: '¿Dónde querés atenderte?' })).toBeVisible();
    await pick(page.getByRole('radio', { name: new RegExp(location ?? 'Consultorio de ejemplo') }));
    await continueStep(page);
  }
  await pickDay(page, dayIndex);
  await expect(page.getByRole('heading', { name: 'Elegí un horario' })).toBeVisible();
  const times = page.getByRole('radio', { name: TIME });
  await pick(times.nth((await times.count()) - timeFromEnd));
  await continueStep(page);
}

export async function bookSlot(page: Page, choice: Choice): Promise<void> {
  await page.goto('/reservar');
  await chooseSlot(page, choice);
  await expect(page.getByRole('heading', { name: 'Revisá y confirmá' })).toBeVisible();
  await page.getByLabel('Obra social (opcional)').selectOption({ label: 'Prepaga Ficticia' });
  await page.getByRole('button', { name: 'Confirmar turno' }).click();
  await expect(page.getByRole('heading', { name: '¡Solicitud enviada!' })).toBeVisible();
  await expect(page.getByRole('status')).toBeFocused();
}
