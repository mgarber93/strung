const path = require('path')
const Strung = require('strung').default

module.exports = [
  {
    mode: 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    target: 'node',
    stats: 'errors-only',
  },
  {
    mode: 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.min.js',
    },
    target: 'node',
    stats: 'errors-only',
    plugins: [
      new Strung({
        verbose: true,
        log: console.log,
      }),
    ]
  },
]
