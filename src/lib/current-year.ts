import { cacheLife } from 'next/cache';
import { argentinaDay } from './format-date-time';

export async function currentYear(): Promise<number> {
  'use cache';
  cacheLife('days');
  return Number(argentinaDay(new Date()).slice(0, 4));
}
