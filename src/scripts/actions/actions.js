'use strict';

var $ = jQuery;
var Reflux = require('reflux');
var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
var commentsRef = ref.child('comments'),
    postsRef = ref.child('posts'),
    usersRef = ref.child('users');

// used to create email hash for gravatar
var hash = require('crypto').createHash('md5');

var actions = Reflux.createActions([
    // user actions
    'login',
    'logout',
    'register',
    'createProfile',
    'updateProfile',
    // post actions
    'upvotePost',
    'downvotePost',
    'submitPost',
    'deletePost',
    'setSortBy',
    // comment actions
    'upvoteComment',
    'downvoteComment',
    'updateCommentCount',
    'addComment',
    'deleteComment',
    // firebase actions
    'listenToProfile',
    'listenToPost',
    'listenToPosts',
    'stopListeningToProfile',
    'stopListeningToPosts',
    'stopListeningToPost',
    // error actions
    'loginError',
    'postError',
    // ui actions
    'showOverlay',
    'goToPost'
]);


/* User Actions
===============================*/

actions.login.preEmit = function (user, username) {
    // username only provided when registering a new user
    // used to create a user profile
    ref.authWithPassword(user, function (error, authData) {
        if (error !== null) {
            actions.loginError(error.code);
        } else if (username) {
            // new user 
            var uid = authData.uid;
            var email = authData.password.email;
            actions.createProfile(uid, username, email);
        }
    });
};

actions.logout.preEmit = function () {
    ref.unauth();
};

actions.register.preEmit = function (username, loginData) {

    function checkForUsername(name) {
        // checks if username is taken
        var defer = $.Deferred();
        usersRef.orderByChild('username').equalTo(name).once('value', function (user) {
            defer.resolve(!!user.val());
        });
        return defer.promise();
    }

    if (!username) {
        // no username provided
        actions.loginError('NO_USERNAME');
    } else {
        // check if username is already taken
        checkForUsername(username).then(function (usernameTaken) {
            if (usernameTaken) {
                actions.loginError('USERNAME_TAKEN');
            } else {
                ref.createUser(loginData, function (error) {
                    if (error !== null) {
                        // error during user creation
                        actions.loginError(error.code);
                    } else {
                        // user successfully created
                        actions.login(loginData, username);
                    }
                });
            }
        });
    }
};

actions.createProfile.preEmit = function (uid, username, email) {
    var md5hash = hash.update(email).digest('hex');
    var profile = {
        username: username,
        md5hash: md5hash,
        upvoted: {}
    };
    usersRef.child(uid).set(profile, function (error) {
        if (error === null) {
            // user profile successfully created
            actions.updateProfile(uid, profile);
        }
    });
};


/* Post Actions
===============================*/

actions.submitPost.preEmit = function (post) {
    var newPostRef = postsRef.push(post, function (error) {
        if (error !== null) {
            actions.postError(error.code);
        } else {
            actions.goToPost(newPostRef.key());
        }
    });
};

actions.deletePost.preEmit = function (postId) {
    postsRef.child(postId).remove();
};

actions.upvotePost.preEmit = function (userId, postId) {
    postsRef.child(postId).child('upvotes').transaction(function (curr) {
        return (curr || 0) + 1;
    }, function (error, success) {
        if (success) {
            // register upvote in user's profile
            usersRef.child(userId).child('upvoted').child(postId).set(true);
        }
    });
};

actions.downvotePost.preEmit = function (userId, postId) {
    postsRef.child(postId).child('upvotes').transaction(function (curr) {
        return curr - 1;
    }, function (error, success) {
        if (success) {
            // register upvote in user's profile
            usersRef.child(userId).child('upvoted').child(postId).remove();
        }
    });
};

/* Comment Actions
===============================*/

actions.updateCommentCount.preEmit = function (postId, n) {
    // updates comment count on post
    postsRef.child(postId).child('commentCount').transaction(function (curr) {
        return curr + n;
    });
};

actions.upvoteComment.preEmit = function (userId, commentId) {
    commentsRef.child(commentId).child('upvotes').transaction(function (curr) {
        return (curr || 0) + 1;
    }, function (error, success) {
        if (success) {
            // register upvote in user's profile
            usersRef.child(userId).child('upvoted').child(commentId).set(true);
        }
    });
};

actions.downvoteComment.preEmit = function (userId, commentId) {
    commentsRef.child(commentId).child('upvotes').transaction(function (curr) {
        return curr - 1;
    }, function (error, success) {
        if (success) {
            // register upvote in user's profile
            usersRef.child(userId).child('upvoted').child(commentId).remove();
        }
    });
};

actions.addComment.preEmit = function (comment) {
    commentsRef.push(comment, function (error) {
        if (error === null) {
            actions.updateCommentCount(comment.postId, 1);
        }
    });
};

actions.deleteComment.preEmit = function (commentId, postId) {
    commentsRef.child(commentId).remove(function (error) {
        if (error === null) {
            actions.updateCommentCount(postId, -1);
        }
    });
};

module.exports = actions;