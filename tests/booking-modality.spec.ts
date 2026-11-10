import { expect, test } from '@playwright/test';
import { activePatient } from './pages/patient';

test.describe('reserva online: modalidad y cron (US-40, T-10)', () => {
  test('US-40 CA-1: las mitades enteras se despliegan desde los costados y, con «reducir movimiento», quedan quietas; al elegir, la barra baja', async ({ browser }, testInfo) => {
    const unfold = testInfo.project.name === 'mobile' ? ['unfold-from-top', 'unfold-from-bottom'] : ['unfold-from-left', 'unfold-from-right'];
    for (const reducedMotion of ['no-preference', 'reduce'] as const) {
      const context = await browser.newContext({ reducedMotion });
      const page = await context.newPage();
      await activePatient(page);
      await page.goto('/reservar');
      await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();
      const animation = (name: string): Promise<string> => page.getByRole('link', { name }).evaluate((element) => getComputedStyle(element).animationName);
      expect([await animation('Elegir presencial'), await animation('Elegir virtual')]).toEqual(reducedMotion === 'reduce' ? ['none', 'none'] : unfold);
      await page.getByRole('link', { name: 'Elegir presencial' }).click({ position: { x: 24, y: 120 } });
      await expect(page.getByRole('heading', { name: '¿Dónde querés atenderte?' })).toBeVisible();
      const bar = page.locator('[data-enter="top"]');
      expect(await bar.evaluate((element) => getComputedStyle(element).animationName)).toBe(reducedMotion === 'reduce' ? 'none' : 'enter-from-top');
      await context.close();
    }
  });

  test('T-10 CA-2: el endpoint del cron sin el secreto responde 401', async ({ request }) => {
    expect((await request.get('/api/cron/expire-pending')).status()).toBe(401);
    expect((await request.get('/api/cron/expire-pending', { headers: { authorization: 'Bearer cualquiera' } })).status()).toBe(401);
  });
});
