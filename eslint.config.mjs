import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */

const basicSettings = {
  files: [ '**/*.{js,mjs,cjs,.html,.css}' ],
  languageOptions: {globals: {
    ...globals.jest,
    ...globals.commonjs,
    ...globals.node,
    ...globals.browser
  }}
};

const basicJsRules = {
  name: 'basicJsRules',
  rules: {
    // 🔹 General JavaScript & TypeScript rules
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',

    // 🔹 General JavaScript rules
    'array-callback-return': 'error',
    'complexity': [ 'error', 10 ],
    'consistent-return': 'off',
    'curly': 'error',
    'dot-notation': 'error',
    'id-length': [ 'error', {
      min: 2,
      exceptions: [ '_', 't', 'x', 'y' ]
    } ],
    'max-lines': [ 'error', 200 ],
    'max-depth': [ 'error', 2 ],
    'no-await-in-loop': 'error',
    'no-console': [ 'warn' ],
    'no-else-return': 'error',
    'no-delete-var': 'error',
    'no-dupe-class-members': 'error',
    'no-duplicate-imports': 'error',
    'no-lone-blocks': 'error',
    'no-nested-ternary': 'error',
    'no-return-await': 'error',
    'no-param-reassign': [ 'error', { props: false } ],
    'no-plusplus': 'off',
    'no-unneeded-ternary': 'error',
    'no-unused-expressions': [ 'error', { allowTernary: true } ],
    'no-unreachable': 'error',
    'no-useless-constructor': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'prefer-arrow-callback': 'error'
  }
};

const formattingRules = {
  name: 'formattingRules',
  plugins: { '@stylistic': stylistic },
  rules: {
    '@stylistic/indent': [ 'error', 2 ],
    '@stylistic/max-len': [ 'error', { 'code': 200 } ],
    '@stylistic/semi': [ 'error', 'always' ],
    '@stylistic/quotes': [ 'error', 'single' ],
    '@stylistic/no-extra-parens': 'error',
    '@stylistic/no-extra-semi': 'error',
    '@stylistic/comma-dangle': [ 'error', 'never' ],
    '@stylistic/arrow-parens': [ 'error', 'always' ],
    '@stylistic/comma-style': [ 'error', 'last' ],
    '@stylistic/computed-property-spacing': [ 'error', 'never', { 'enforceForClassMembers': true } ],
    '@stylistic/curly-newline': [ 'error', 'always' ],
    '@stylistic/brace-style': [ 'error', '1tbs' ],
    '@stylistic/block-spacing': [ 'error', 'always' ],
    '@stylistic/function-call-spacing': [ 'error', 'never' ],
    '@stylistic/implicit-arrow-linebreak': [ 'error', 'beside' ],
    '@stylistic/lines-around-comment': [ 'error', { 'beforeBlockComment': true } ],
    '@stylistic/object-curly-newline': [ 'error', { 'minProperties': 2 } ],
    '@stylistic/object-property-newline': 'error',
    '@stylistic/space-before-blocks': 'error',
    '@stylistic/space-before-function-paren': [ 'error', 'never' ],
    '@stylistic/space-in-parens': [ 'error', 'always' ],
    '@stylistic/space-infix-ops': 'error',
    '@stylistic/spaced-comment': [ 'error', 'always' ],
    '@stylistic/arrow-spacing': [ 'error', {
      'before': true,
      'after': true
    } ],
    '@stylistic/array-bracket-spacing': [ 'error', 'always', {
      objectsInArrays: true,
      arraysInArrays: true
    } ]
  }
};

const customRules = {
  name: 'customRules',
  rules: {}
};

export default [
  basicSettings,
  basicJsRules,
  formattingRules,
  customRules
];
