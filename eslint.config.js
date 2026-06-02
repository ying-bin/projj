'use strict';

const js = require('@eslint/js');

const nodeGlobals = {
  __dirname: 'readonly',
  __filename: 'readonly',
  Buffer: 'readonly',
  clearTimeout: 'readonly',
  console: 'readonly',
  exports: 'writable',
  module: 'readonly',
  process: 'readonly',
  require: 'readonly',
  setTimeout: 'readonly',
};

module.exports = [
  {
    ignores: [
      'coverage/**',
      'node_modules/**',
    ],
  },
  {
    files: [
      '**/*.js',
    ],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'commonjs',
      globals: nodeGlobals,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': [ 'error', { caughtErrors: 'none' }],
    },
  },
];
