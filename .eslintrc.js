module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: '2021',
  },
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }, { usePrettierrc: true }],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        ignoredNodes: [
          'ConditionalExpression', 
          'FunctionDeclaration':{
            "body": 1,
            "parameters": 2
          },
          'FunctionExpression':{
            "body": 1,
            "parameters": 2
          }
        ],
      },
    ],
    'linebreak-style': 0,
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-debugger': 0,
    'object-curly-spacing': ['error', 'always'],
    'no-shadow': 0,
    'no-console': 0,
    'arrow-body-style': 2,
    'consistent-return': 0,
    'no-param-reassign': 0,
    'no-use-before-define': 0,
    'no-underscore-dangle': 0,
    'no-unused-vars': [
      2,
      {
        ignoreRestSiblings: false,
      },
    ],
    'prefer-destructuring': [
      2,
      {
        object: true,
        array: false,
      },
    ],
  },
};
