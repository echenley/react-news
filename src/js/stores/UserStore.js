'use strict';

import Reflux from 'reflux';
import update from 'react-addons-update';
import Actions from '../actions/Actions';
import { firebaseUrl } from '../util/constants';

import Firebase from 'firebase';
const baseRef = new Firebase(firebaseUrl);
const usersRef = baseRef.child('users');

const defaultUser = {
    uid: '',
    username: '',
    upvoted: null,
    submitted: null,
    isLoggedIn: false,
    md5hash: null,
    latestPost: null
};

let currentUser = Object.assign({}, defaultUser);

const UserStore = Reflux.createStore({

    listenables: Actions,

    init() {
        // triggered by auth changes
        baseRef.onAuth((authData) => {
            if (!authData) {
                // user is logged out
                usersRef.off();
                this.logoutCompleted();
            } else {
                // user is logged in
                this.loginCompleted(authData.uid);
            }
        });
    },

    logout() {
        baseRef.unauth();
    },

    logoutCompleted() {
        // reset currentUser to default
        currentUser = Object.assign({}, defaultUser);
        this.trigger(currentUser);
    },

    loginCompleted(userId) {
        // get username
        usersRef.child(userId).once('value', (profile) => {
            let {
                username,
                upvoted,
                submitted,
                md5hash
            } = profile.val();

            currentUser = {
                uid: userId,
                username: username,
                upvoted: upvoted,
                submitted: submitted || null,
                md5hash: md5hash,
                isLoggedIn: true,
                latestPost: null
            };

            // watch upvotes
            usersRef.child(`${userId}/upvoted`).on('value', (upvoted) => {
                this.updateUpvoted(upvoted.val());
            });

            // watch submissions
            usersRef.child(`${userId}/submitted`).on('value', (submitted) => {
                let submittedVal = submitted.val();
                this.updateSubmitted(submittedVal ? Object.keys(submittedVal) : []);
            });
        });
    },

    updateLatestPost(postId) {
        currentUser = update(currentUser, {
            latestPost: { $set: postId }
        });

        this.trigger(currentUser);
    },

    updateUpvoted(newUpvoted) {
        currentUser = update(currentUser, {
            upvoted: { $set: newUpvoted }
        });

        this.trigger(currentUser);
    },

    updateSubmitted(newSubmitted) {
        currentUser = update(currentUser, {
            submitted: { $set: newSubmitted || null }
        });

        this.trigger(currentUser);
    },

    getUserId(username) {
        // returns userId given username
        return new Promise((resolve) => {
            usersRef.orderByChild('username').equalTo(username).once('value', (user) => {
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
