'use strict';

var Reflux = require('reflux');

var errorActions = Reflux.createActions([
    'loginError',
    'postError'
]);

module.exports = errorActions;