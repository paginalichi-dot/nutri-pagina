import { expect, type Page } from '@playwright/test';

export type Transform = { scale: number; x: number; y: number };

export const transformOf = (page: Page, selector: string): Promise<Transform> =>
  page.evaluate((target) => {
    const element = document.querySelector(target);
    const matrix = new DOMMatrixReadOnly(element ? getComputedStyle(element).transform : 'none');
    return { scale: matrix.a, x: matrix.m41, y: matrix.m42 };
  }, selector);

export async function sees(page: Page, selector: string, check: (transform: Transform) => boolean): Promise<void> {
  await expect.poll(async () => check(await transformOf(page, selector)), { intervals: [16], timeout: 8000 }).toBe(true);
}

export async function introDone(page: Page): Promise<void> {
  await expect(page.locator('html')).toHaveAttribute('data-intro-state', 'done', { timeout: 8000 });
}

export const clipOfMain = (page: Page): Promise<string> =>
  page.evaluate(() => getComputedStyle(document.querySelector('main') ?? document.body).clipPath);
