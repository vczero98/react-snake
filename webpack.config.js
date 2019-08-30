const path = require('path');

module.exports = {
    entry: './src/react/index.js',
    watchOptions: {
		ignored: /node_modules/
	},
    output: {
		filename: 'build/build.js',
		path: path.resolve(__dirname, 'js/')
	},
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};