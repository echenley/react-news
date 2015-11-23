'use strict';

var path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                include: [
                    path.join(__dirname, 'src'),
                    path.join(__dirname, 'test')
                ],
                loader: 'babel'
            },
            {
                test: /\.scss$/,
                loader: 'null'
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline'
            }
        ],
        postLoaders: [{
            test: /\.(js|jsx)$/,
            include: [path.join(__dirname, 'src')],
            loader: 'istanbul-instrumenter'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    }
};
