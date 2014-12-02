'use strict';

var $ = jQuery;
var Reflux = require('reflux');
var actions = require('../actions/actions');
var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
var usersRef = ref.child('users');

var defaultUser = {
    uid: '',
    profile: {
        username: '',
        upvoted: {}
    },
    isLoggedIn: false
};

var appStore = Reflux.createStore({

    listenables: actions,

    init: function () {
        this.appData = {
            user: defaultUser
        };

        ref.onAuth(function (authData) {
            if (authData) {
                var userId = authData.uid;
                usersRef.child(userId).on('value', function (profile) {
                    this.updateProfile(userId, profile.val());
                }.bind(this));
            } else {
                usersRef.off('value');
                this.logout();
            }
        }.bind(this));
    },

    updateProfile: function (userId, profile) {
        this.appData.user = {
            uid: userId,
            profile: profile,
            isLoggedIn: true
        };
        this.trigger(this.appData);
    },

    logout: function () {
        this.appData.user = defaultUser;
        this.trigger(this.appData);
    },

    getUserId: function (username) {
        // returns userId given username
        var defer = $.Deferred();
        usersRef.orderByChild('username').equalTo(username).once('value', function (user) {
            var userId = Object.keys(user.val())[0];
            defer.resolve(userId);
        });
        return defer.promise();
    },

    getDefaultData: function () {
        return this.appData;
    }
});

module.exports = appStore;















