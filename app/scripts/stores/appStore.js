'use strict';

var Reflux = require('reflux');
var actions = require('../actions/actions');

var appStore = Reflux.createStore({

    listenables: actions,

    postError: function (errorCode) {
        var message = errorCode;
        if (errorCode === 'PERMISSION_DENIED') {
            message = '';
        }
        console.log(errorCode);
        this.trigger(message);
    }

});

module.exports = appStore;