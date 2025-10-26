import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';

const compat = new FlatCompat({
  baseDirectory: new URL('.', import.meta.url).pathname,
});

export default [
  // ESLint recommended
  compat.config({ extends: ['eslint:recommended'] }),
  // TypeScript recommended
  compat.config({ extends: ['plugin:@typescript-eslint/recommended'] }),
  compat.config({ extends: ['plugin:@typescript-eslint/recommended-requiring-type-checking'] }),
  // Prettier recommended
  compat.config({ extends: ['plugin:prettier/recommended'] }),

  {
    ignores: ['eslint.config.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: new URL('.', import.meta.url).pathname,
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
];
