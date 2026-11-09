import { randomUUID } from 'node:crypto';
import { expect, type Locator, type Page } from '@playwright/test';
import { linkSentTo } from '../support/outbox';
import { freshClient } from './panel';

export const PASSWORD = 'clave-e2e-paciente';

export const newEmail = (): string => `e2e-${randomUUID()}@ejemplo.test`;

export async function registerPatient(page: Page, email: string): Promise<void> {
  await freshClient(page);
  await page.goto('/registro');
  await page.getByLabel('Nombre y apellido').fill('Paciente E2E');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Teléfono (WhatsApp)').fill('11 2345-6789');
  await page.getByLabel('Contraseña', { exact: true }).fill(PASSWORD);
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Crear mi cuenta' }).click();
  await expect(page.getByText('Te enviamos un correo electrónico para activar tu cuenta.')).toBeVisible();
}

export async function openLink(page: Page, { email, path, button }: { email: string; path: string; button: string }): Promise<void> {
  await page.goto(await linkSentTo(email, path));
  await page.getByRole('button', { name: button }).click();
  await expect(page.getByText('Listo.')).toBeVisible();
}

export async function signInAs(page: Page, email: string, password: string = PASSWORD): Promise<void> {
  await freshClient(page);
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Contraseña', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
}

export async function activePatient(page: Page): Promise<string> {
  const email = newEmail();
  await registerPatient(page, email);
  await openLink(page, { email, path: '/verificar', button: 'Activar mi cuenta' });
  await signInAs(page, email);
  await expect(page).toHaveURL(/\/mi-espacio$/);
  return email;
}

export const card = (page: Page, title: string): Locator => page.locator('section', { has: page.getByRole('heading', { name: title }) }).last();

export async function openTab(page: Page, name: string): Promise<Locator> {
  await page.getByRole('tab', { name }).click();
  return card(page, name);
}

export async function openAccountMenu(page: Page): Promise<Locator> {
  const account = page.getByRole('button', { name: 'Mi cuenta' });
  await expect(async () => {
    if ((await account.getAttribute('aria-expanded')) !== 'true') await account.click();
    await expect(account).toHaveAttribute('aria-expanded', 'true', { timeout: 1_000 });
  }).toPass();
  return page.getByRole('region', { name: 'Mi espacio' });
}
