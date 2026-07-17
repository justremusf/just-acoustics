import { createRequire } from 'node:module'
import path from 'node:path'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'

const require = createRequire(import.meta.url)
const nextConfigDirectory = path.dirname(require.resolve('eslint-config-next/package.json'))
const nextPlugin = require(require.resolve('@next/eslint-plugin-next', { paths: [nextConfigDirectory] }))

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'outputs/**', 'tmp/**', 'generated/**', 'public/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@next/next': nextPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
]
