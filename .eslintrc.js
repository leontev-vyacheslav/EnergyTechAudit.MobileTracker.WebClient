// https://github.com/prettier/eslint-config-prettier
// https://eslint.org/
// https://www.npmjs.com/package/eslint-plugin-react
// https://classic.yarnpkg.com/en/docs/migrating-from-npm/
// https://habr.com/ru/company/skillbox/blog/428231/
module.exports = {
  root: true,
  'plugins': ['react', 'react-hooks', 'prettier'],
  'extends': [
    'prettier',
    'prettier/flowtype',
    'prettier/react',
    'prettier/standard',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  'parserOptions': {
    'sourceType': 'module',
    'ecmaVersion': 2020,
    'ecmaFeatures': {
      'jsx': true,
      'modules': true
    },
  },
  'settings': {
    'react': {
      'version': '16.13.1'
    }
  },
  'rules': {
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
