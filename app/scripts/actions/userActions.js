'use strict';

var Reflux = require('reflux');

var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
var usersRef = ref.child('users');

// used to create email hash for gravatar
var hash = require('crypto').createHash('md5');

var userActions = Reflux.createActions([
    'login',
    'logout',
    'register',
    'upvoteItem',
    'createProfile',
    'updateProfile',
    'setFirebaseCallback',
    'removeFirebaseCallback'
]);

userActions.login.preEmit = function (user, username) {
    // username only provided when registering a new user
    // used to create a user profile
    ref.authWithPassword(user, function(error, authData) {
        if (username) {
            // new user 
            var uid = authData.uid;
            var email = authData.password.email;
            userActions.createProfile(uid, username, email);
        }
    }.bind(this));
};

userActions.logout.preEmit = function () {
    ref.unauth();
};

userActions.register.preEmit = function (username, loginData) {
    ref.createUser(loginData, function (error) {
        if (error === null) {
            // user successfully created
            userActions.login(loginData, username);
        }
    }.bind(this));
};

userActions.upvoteItem.preEmit = function (userId, itemId, alreadyUpvoted) {
    // adds or removes postId/commentId from list of upvoted items
    if (alreadyUpvoted) {
        usersRef.child(userId).child('upvoted').child(itemId).remove();
    } else {
        usersRef.child(userId).child('upvoted').child(itemId).set(true);
    }
};

userActions.createProfile.preEmit = function (uid, username, email) {
    var md5hash = hash.update(email).digest('hex');
    var profile = {
        username: username,
        md5hash: md5hash,
        upvoted: {}
    };
    usersRef.child(uid).set(profile, function (error) {
        if (error === null) {
            // user profile successfully created
            userActions.updateProfile(uid, profile);
        }
    }.bind(this));
};


module.exports = userActions;