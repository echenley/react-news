'use strict';

var webpackTestConfig = require('../webpack.tests.config.js');

module.exports = function(config) {
    config.set({
        browsers: ['Chrome'],
        // karma only needs to know about the test bundle
        files: ['./test.bundle.js'],
        singleRun: true,
        frameworks: [
            'chai',
            'mocha',
            'sinon',
            'sinon-chai',
            'phantomjs-shim'
        ],
        plugins: [
            'karma-chrome-launcher',
            'karma-chai',
            'karma-mocha',
            'karma-sinon',
            'karma-sinon-chai',
            'karma-sourcemap-loader',
            'karma-webpack',
            'karma-coverage',
            'karma-mocha-reporter',
            'karma-phantomjs-launcher',
            'karma-phantomjs-shim'
        ],
        phantomjsLauncher: {},
        // run the bundle through the webpack and sourcemap plugins
        preprocessors: {
            './test.bundle.js': ['webpack', 'sourcemap']
        },
        reporters: ['mocha', 'coverage'],
        mochaReporter: {
            output: 'autowatch'
        },
        coverageReporter: {
            type: 'text'
        },
        singleRun: true,
        // webpack config object
        webpack: webpackTestConfig,
        webpackMiddleware: {
            noInfo: true,
        },
        port: 3300
    });
};
