'use strict';

import Promise from 'bluebird';
import Reflux from 'reflux';
import Actions from '../actions/Actions';

import Firebase from 'firebase';

import extend from 'lodash/object/extend';

let baseRef = new Firebase('https://resplendent-fire-4810.firebaseio.com');

// let postsRef = baseRef.child('posts');
let usersRef = baseRef.child('users');

// used to create email hash for gravatar
let hash = require('crypto').createHash('md5');

let defaultUser = {
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
                // logging out
                usersRef.off();
                this.logoutCompleted();
            } else {
                // user is logged in
                let userId = authData.uid;

                // watch their profile for updates
                usersRef.child(userId).on('value', profile => (
                    this.updateProfile(userId, profile.val())
                ));
            }
        }.bind(this));
    },

    logout() {
        baseRef.unAuth();
    },

    logoutCompleted() {
        // reset currentUser to default
        currentUser = extend({}, defaultUser);
        this.trigger(currentUser);
    },

    updateProfile(userId, newProfile) {
        currentUser = extend({}, {
            uid: userId,
            profile: newProfile,
            isLoggedIn: true
        });

        this.trigger(currentUser);
    },

    createProfile(uid, username, email) {
        let md5hash = hash.update(email).digest('hex');

        let profile = {
            username: username,
            md5hash: md5hash,
            upvoted: {}
        };

        usersRef.child(uid).set(profile, error => {
            if (error === null) {
                // user profile successfully created
                this.updateProfile(uid, profile);
            }
        });
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
