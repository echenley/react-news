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

var userStore = Reflux.createStore({

    listenables: actions,

    init: function() {
        this.user = defaultUser;
    },

    updateProfile: function(userId, profile) {
        this.user = {
            uid: userId,
            profile: profile,
            isLoggedIn: true
        };
        this.trigger(this.user);
    },

    logoutCompleted: function() {
        this.user = defaultUser;
        this.trigger(this.user);
    },

    getUserId: function(username) {
        // returns userId given username
        var defer = $.Deferred();
        usersRef.orderByChild('username').equalTo(username).once('value', function(user) {
            var userId = Object.keys(user.val())[0];
            defer.resolve(userId);
        });
        return defer.promise();
    },

    getDefaultData: function() {
        return this.user;
    }
});

module.exports = userStore;















