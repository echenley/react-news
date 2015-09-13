var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        './src/js/render.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.min.js'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                include: path.join(__dirname, 'src'),
                loaders: ['babel-loader']
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin({
            title: 'react-news',
            template: './src/index.html',
            scriptFilename: 'app.min.js'
        })
    ]
};
