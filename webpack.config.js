var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var friendlyFormatter = require('eslint-friendly-formatter');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:3000',
        'webpack/hot/only-dev-server',
        './src/js/render.js'
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'app.js'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                include: path.join(__dirname, 'src'),
                loaders: ['react-hot', 'babel-loader', 'eslint-loader']
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            }
        ]
    },
    eslint: {
        formatter: friendlyFormatter,
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'react-news',
            template: './src/index.html',
            scriptFilename: 'app.js'
        })
    ]
};
