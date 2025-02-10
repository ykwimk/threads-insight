import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:@typescript-eslint/recommended',
      'next/core-web-vitals',
      'next/typescript',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['import'],
    rules: {
      '@next/next/no-img-element': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
            'unknown',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: 'react/**',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: 'next',
              group: 'builtin',
              position: 'after',
            },
            {
              pattern: 'next/**',
              group: 'builtin',
              position: 'after',
            },
            {
              pattern: 'public/**',
              group: 'unknown',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'next'],
          warnOnUnassignedImports: true,
        },
      ],
      'react-hooks/exhaustive-deps': 'off',
      'react/display-name': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/interactive-supports-focus': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          required: {
            some: ['nesting', 'id'],
          },
        },
      ],
      'jsx-a11y/label-has-for': [
        'error',
        {
          required: {
            some: ['nesting', 'id'],
          },
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  }),
];

export default eslintConfig;
