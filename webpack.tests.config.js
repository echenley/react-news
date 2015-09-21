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
                loaders: ['babel?optional[]=runtime']
            },
            {
                test: /\.scss$/,
                loader: 'null'
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    }
};
