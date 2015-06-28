'use strict';

import Promise from 'bluebird';
import Reflux from 'reflux';
import Actions from '../actions/Actions';

import Firebase from 'firebase';

import extend from 'lodash/object/extend';

const baseRef = new Firebase('https://resplendent-fire-4810.firebaseio.com');
const usersRef = baseRef.child('users');

const defaultUser = {
    uid: '',
    profile: {
        username: '',
        upvoted: {}
    },
    isLoggedIn: false
};

// copy defaultUser to currentUser
let currentUser = extend({}, defaultUser);

const UserStore = Reflux.createStore({

    listenables: Actions,

    init() {
        // triggered by auth changes
        baseRef.onAuth(function(authData) {
            if (!authData) {
                // user is logged out
                usersRef.off();
                this.logoutCompleted();
            } else {
                // user is logged in
                this.loginCompleted(authData.uid);
            }
        }.bind(this));
    },

    logout() {
        baseRef.unauth();
    },

    logoutCompleted() {
        // reset currentUser to default
        currentUser = extend({}, defaultUser);
        this.trigger(currentUser);
    },

    loginCompleted(userId) {
        // watch their profile for updates
        usersRef.child(userId).on('value', profile => (
            this.updateProfile(userId, profile.val())
        ));
    },

    updateProfile(userId, newProfile) {
        currentUser = extend({}, {
            uid: userId,
            profile: newProfile,
            isLoggedIn: true
        });

        this.trigger(currentUser);
    },

    getUserId(username) {
        // returns userId given username
        return new Promise(function(resolve) {
            usersRef.orderByChild('username').equalTo(username).once('value', function(user) {
                let userId = Object.keys(user.val())[0];
                resolve(userId);
            });
        });
    },

    getDefaultData() {
        return currentUser;
    }
});

export default UserStore;
