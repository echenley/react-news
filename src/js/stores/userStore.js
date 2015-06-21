'use strict';

var Promise = require('bluebird');
var Reflux = require('reflux');
var Actions = require('../actions/Actions');

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

var UserStore = Reflux.createStore({

    listenables: Actions,

    init() {
        this.user = defaultUser;
    },

    updateProfile(userId, profile) {
        this.user = {
            uid: userId,
            profile: profile,
            isLoggedIn: true
        };
        this.trigger(this.user);
    },

    logoutCompleted() {
        this.user = defaultUser;
        this.trigger(this.user);
    },

    getUserId: function(username) {
        // returns userId given username
        return new Promise(function(resolve) {
            usersRef.orderByChild('username').equalTo(username).once('value', function(user) {
                var userId = Object.keys(user.val())[0];
                resolve(userId);
            });
        });
    },

    getDefaultData() {
        return this.user;
    }
});

module.exports = UserStore;
