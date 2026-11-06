const config = {
  testRunner: 'vitest',
  vitest: { configFile: 'vitest.mutation.config.mts' },
  mutate: ['src/features/*/domain/**/*.ts', 'src/features/*/services/**/*.ts', 'src/lib/**/*.ts', '!src/lib/db/**', '!src/**/*.test.ts'],
  reporters: ['clear-text', 'html', 'progress'],
  htmlReporter: { fileName: 'reports/mutation/mutation.html' },
  thresholds: { high: 85, low: 70, break: 70 },
  incremental: true,
  incrementalFile: 'reports/stryker-incremental.json',
  tempDirName: '.stryker-tmp',
};

export default config;
