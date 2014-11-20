'use strict';

var Reflux = require('reflux');

var errorActions = require('../actions/errorActions');

var errorStore = Reflux.createStore({

    listenables: errorActions,

    loginError: function (errorCode) {
        var message;
        switch (errorCode) {
            case 'INVALID_EMAIL':
                message = 'Invalid email address.'; break;
            case 'INVALID_PASSWORD':
                message = 'Invalid password.'; break;
            case 'INVALID_USER':
                message = 'User doesn\'t exist.'; break;
            case 'NO_USERNAME':
                message = 'You must enter a username.'; break;
            case 'USERNAME_TAKEN':
                message = 'That username is taken.'; break;
            default:
                message = 'Something went wrong.';
        }
        this.trigger(message);
    },

    getDefaultData: function () {
        return '';
    }
});

module.exports = errorStore;