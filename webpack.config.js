const path = require('path');

module.exports = {
    mode: 'development', // or 'production'
    entry: './src/index.js', // Your app's entry point
    output: {
        path: path.resolve(__dirname, 'dist'), // Output directory
        filename: 'bundle.js', // Output file name
        publicPath: '/', // Base path for the output files
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
        historyApiFallback: true, // For React Router
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // Transpile JavaScript and JSX files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'], // Use env and react presets
                    },
                },
            },
            {
                test: /\.css$/, // Load CSS files
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'], // Resolve these extensions
    },
    devtool: 'source-map', // Enable source maps for easier debugging
};
