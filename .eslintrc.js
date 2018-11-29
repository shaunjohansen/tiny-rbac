module.exports = {
  'extends': [ 'eslint:recommended' ],
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'jasmine': true,
  },
  'rules': {
    'max-lines': ['error', {'max': 300, 'skipBlankLines': true}],
    'jsx-quotes': ['warn', 'prefer-single'],
    'no-console': 'warn',
    'indent': [ 'error', 2 ],
    'linebreak-style': [ 'error', 'unix' ],
    'quotes': [ 'error', 'single' ],
    'semi': [ 'error', 'never' ],
    'comma-dangle': [ 'error', 'always-multiline' ],
    'no-multi-spaces': 'warn',
    'eol-last': ['error', 'always'],
    'indent': ['error', 2, {
      'SwitchCase': 1,
    }],
  },
}
