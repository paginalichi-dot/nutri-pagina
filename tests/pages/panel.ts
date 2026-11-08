import { expect, type Page } from '@playwright/test';
import { TEST_ADMIN } from '../../src/features/auth/testing/test-admin';

export async function signIn(page: Page, credentials: { email: string; password: string } = TEST_ADMIN): Promise<void> {
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill(credentials.email);
  await page.getByLabel('Contraseña').fill(credentials.password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Agenda');
}

export async function signOut(page: Page): Promise<void> {
  await page.getByRole('navigation', { name: 'Panel' }).getByRole('link', { name: 'Mi cuenta' }).click();
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ingresá al panel');
}

const argentinaDay = (date: Date): string => new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' }).format(date);

export function weekdayFromToday(offset: number): string {
  const date = new Date(Date.now() + offset * 86_400_000);
  while ([0, 6].includes(new Date(`${argentinaDay(date)}T12:00:00Z`).getUTCDay())) date.setTime(date.getTime() + 86_400_000);
  return argentinaDay(date);
}
