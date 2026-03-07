import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'vite';

export default defineConfig(
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      react.configs.flat.recommended,
      jsxA11y.configs.flat.recommended,
      prettier,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      import: importPlugin,
      prettier,
    },
    rules: {
      'import/order': ['error', { groups: ['builtin', 'external', 'internal'] }],
      'prettier/prettier': 'error',
    },
  }
);   