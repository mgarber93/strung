const path = require('path')

module.exports = {
	mode: 'production',
	entry: './src/Strungifier.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		library: 'strung',
		libraryTarget: 'umd'
	},
    target: 'node',
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],
	},
	optimization: {
		noEmitOnErrors: true
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	}
}
