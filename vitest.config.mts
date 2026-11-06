import { fileURLToPath } from 'node:url';
import { configDefaults, defineConfig } from 'vitest/config';

const emptyModule = fileURLToPath(new URL('./src/test/empty-module.ts', import.meta.url));

const NOT_COVERED = ['eslint/**', 'scripts/**', 'prisma/**', 'src/generated/**', 'src/app/**', 'src/proxy.ts', 'src/config/**', 'src/**/repository/**', 'src/lib/db/index.ts', 'src/lib/db/transaction.ts', 'src/test/**', 'src/**/testing/**'];
const UNIT_SETUP = ['./src/test/setup/next-headers.setup.ts', './src/test/setup/next-cache.setup.ts', './src/test/setup/no-database.setup.ts'];

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: { 'server-only': emptyModule },
  },
  test: {
    allowOnly: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: NOT_COVERED,
      thresholds: { lines: 90, functions: 90, statements: 90, branches: 85 },
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts'],
          exclude: [...configDefaults.exclude, 'src/**/*.int.test.ts'],
          setupFiles: UNIT_SETUP,
        },
      },
      {
        extends: true,
        test: {
          name: 'component',
          environment: 'jsdom',
          testTimeout: 15_000,
          include: ['src/**/*.test.tsx'],
          setupFiles: ['./src/test/setup/component.setup.ts', './src/test/setup/no-database.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          environment: 'node',
          include: ['src/**/*.int.test.ts'],
          globalSetup: ['./src/test/integration.global-setup.ts'],
          setupFiles: ['./src/test/setup/next-headers.setup.ts', './src/test/setup/next-cache.setup.ts'],
          fileParallelism: false,
        },
      },
    ],
  },
});
