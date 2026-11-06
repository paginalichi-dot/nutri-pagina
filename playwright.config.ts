import { defineConfig, devices } from '@playwright/test';
import { assertTestDatabaseUrl } from './src/test/test-database-url';

const { CI, LOCAL_DATABASE_URL, NODE_ENV, APP_ENV } = process.env;
assertTestDatabaseUrl({ url: LOCAL_DATABASE_URL, nodeEnv: NODE_ENV, appEnv: APP_ENV });

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;
const isCi = Boolean(CI);

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  workers: isCi ? 1 : undefined,
  reporter: isCi ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run e2e:server',
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 300_000,
    env: { NODE_OPTIONS: '', NEXT_DIST_DIR: '.next-e2e' },
  },
});
