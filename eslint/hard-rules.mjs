export const CODE_FILES = ['**/*.{ts,tsx,mts,js,mjs}'];
export const TS_FILES = ['**/*.{ts,tsx}'];
export const TEST_FILES = ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.setup.ts', '**/*.behavior.ts'];

export const codeRules = {
  'max-lines': ['error', { max: 100, skipBlankLines: false, skipComments: false }],
  'max-lines-per-function': ['error', { max: 40, skipBlankLines: false, skipComments: false }],
  'max-params': ['error', 3],
  'local/no-comments': 'error',
};

export const typescriptRules = {
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-non-null-assertion': 'error',
  '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
  '@typescript-eslint/explicit-module-boundary-types': 'error',
};
