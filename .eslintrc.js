// https://github.com/prettier/eslint-config-prettier
// https://eslint.org/
// https://www.npmjs.com/package/eslint-plugin-react
// https://classic.yarnpkg.com/en/docs/migrating-from-npm/
// https://habr.com/ru/company/skillbox/blog/428231/
module.exports = {
  root: true,
  'parser': '@typescript-eslint/parser',
  'plugins': ['react', 'react-hooks', 'prettier', '@typescript-eslint'],
  'extends': [
    'prettier',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'parserOptions': {
    'sourceType': 'module',
    'ecmaVersion': 2021,
    'ecmaFeatures': {
      'jsx': true,
      'modules': true
    },
  },
  'settings': {
    'react': {
      'version': '17.0.2'
    }
  },
  'rules': {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unused-vars': ['warn', { 'vars': 'all', 'args': 'none', 'ignoreRestSiblings': false }],
    'object-curly-spacing': [2, 'always'],
    'prettier/prettier': [0, 'always'],
    'quotes': [
      'error',
      'single'
    ],
    'react/display-name': 'off',
    'react/prop-types' : 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-curly-spacing': ['error', 'always'],
  },
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
    'jasmine': true
  },
};
