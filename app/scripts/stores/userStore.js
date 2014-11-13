'use strict';

var Reflux = require('reflux');

var userActions = require('../actions/userActions');

var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
var usersRef = ref.child('users');

var userStore = Reflux.createStore({

    listenables: userActions,

    init: function () {
        this.user = {
            uid: '',
            profile: {
                username: 'anon'
            }
        };

        ref.onAuth(function (authData) {
            if (authData) {
                var userId = authData.uid;
                usersRef.child(userId).on('value', function(profile) {
                    this.updateProfile(userId, profile.val());
                }.bind(this));
            } else {
                usersRef.off('value');
            }
        }.bind(this));
    },

    updateProfile: function (uid, profile) {
        this.user = {
            uid: uid,
            profile: profile
        };
        this.trigger(this.user);
    },

    logout: function () {
        this.user = {
            uid: '',
            profile: {
                username: 'anon'
            }
        };
        this.trigger(this.user);
    },

    getDefaultData: function () {
        return this.user;
    }
});

module.exports = userStore;















