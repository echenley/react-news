'use strict';

var Reflux = require('reflux');
var userActions = require('../actions/userActions');

var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
var profileRef = ref.child('profile');


var userStore = Reflux.createStore({

    listenables: userActions,

    init: function () {
        this.user = false;

        // User Authentication
        ref.onAuth(function (authData) {
            if (authData) {
                // user authenticated with Firebase
                profileRef.child(authData.uid).once('value', function (profile) {
                    this.user = {
                        uid: authData.uid,
                        profile: profile.val()
                    };
                    this.trigger(this.user);
                }.bind(this));
            } else {
                // user is logged out
                this.user = false;
                this.trigger(this.user);
            }
        }.bind(this));
    },

    signIn: function (newUser) {
        ref.authWithPassword(newUser, function(error) {
            if (error !== null) {
                // error during authentication
                console.log("Error authenticating user:", error.code);
            }
        }.bind(this));
    },

    signOut: function () {
        ref.unauth();
    },

    isSignedIn: function () {
        return !!ref.getAuth();
    },

    getDefaultData: function () {
        return this.user;
    }
});

module.exports = userStore;















