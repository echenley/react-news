'use strict';

var Reflux = require('reflux');
var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
var usersRef = ref.child('users');

var errorActions = require('./errorActions');

// used to create email hash for gravatar
var hash = require('crypto').createHash('md5');

var userActions = Reflux.createActions([
    'login',
    'logout',
    'register',
    'upvoteItem',
    'downvoteItem',
    'createProfile',
    'updateProfile'
]);

userActions.login.preEmit = function (user, username) {
    // username only provided when registering a new user
    // used to create a user profile
    ref.authWithPassword(user, function(error, authData) {
        if (error !== null) {
            errorActions.loginError(error.code);
        } else if (username) {
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

    function checkUsername(name) {
        // checks if username is taken
        var defer = jQuery.Deferred();
        usersRef.orderByChild('username').equalTo(name).once('value', function (user) {
            defer.resolve(!!user.val());
        });
        return defer.promise();
    }

    if (!username) {
        // no username provided
        errorActions.loginError('NO_USERNAME');
    } else {
        checkUsername(username).then(function (usernameTaken) {
            if (usernameTaken) {
                errorActions.loginError('USERNAME_TAKEN');
            } else {
                ref.createUser(loginData, function (error) {
                    if (error !== null) {
                        // error during user creation
                        errorActions.loginError(error.code);
                    } else {
                        // user successfully created
                        userActions.login(loginData, username);
                    }
                }.bind(this));
            }
        });
    }
};

userActions.upvoteItem.preEmit = function (userId, itemId) {
    // adds postId/commentId from list of upvoted items
    usersRef.child(userId).child('upvoted').child(itemId).set(true);
};

userActions.downvoteItem.preEmit = function (userId, itemId) {
    // removes postId/commentId from list of upvoted items
    usersRef.child(userId).child('upvoted').child(itemId).remove();
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