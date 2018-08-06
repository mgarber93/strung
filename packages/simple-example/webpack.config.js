const path = require('path')
const Strung = require('strung')

module.exports = {
  mode: 'development', // "production" | "development" | "none"  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'), // string
    filename: 'bundle.js', // string    // the filename template for entry chunks
    publicPath: '/assets/', // string    // the url to the output directory resolved relative to the HTML page
    library: 'MyLibrary', // string,
    libraryTarget: 'umd'
  },
  target: 'node',
  stats: 'errors-only',
  plugins: [
    new Strung({})
  ]
}
