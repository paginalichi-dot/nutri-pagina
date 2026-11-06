import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import { CODE_FILES, TEST_FILES, TS_FILES, codeRules, typescriptRules } from './eslint/hard-rules.mjs';
import { layerConfigs } from './eslint/layers.mjs';
import { localPlugin } from './eslint/rules/no-comments.mjs';

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: ['**/node_modules/**', '.next/**', '.next-e2e/**', 'out/**', 'build/**', 'public/**', 'src/generated/**', '**/playwright-report/**', '**/test-results/**', 'coverage/**', 'reports/**', '.stryker-tmp/**', '.agents/**', '.claude/**', 'lichi-pagina/**', 'next-env.d.ts'],
  },
  { files: CODE_FILES, plugins: { local: localPlugin }, rules: codeRules },
  { files: TS_FILES, rules: typescriptRules },
  { files: TEST_FILES, rules: { 'max-lines-per-function': 'off' } },
  ...layerConfigs,
  prettierConfig,
];

export default eslintConfig;
