'use strict';

var Promise = require('bluebird');
var Reflux = require('reflux');
var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
var commentsRef = ref.child('comments');
var postsRef = ref.child('posts');
var usersRef = ref.child('users');

// used to create email hash for gravatar
var hash = require('crypto').createHash('md5');

var Actions = Reflux.createActions({
    // user actions
    'login': {},
    'logout': { asyncResult: true },
    'register': {},
    'createProfile': {},
    'updateProfile': {},
    // post actions
    'upvotePost': {},
    'downvotePost': {},
    'submitPost': { asyncResult: true },
    'deletePost': {},
    'setSortBy': {},
    // comment actions
    'upvoteComment': {},
    'downvoteComment': {},
    'updateCommentCount': {},
    'addComment': {},
    'deleteComment': {},
    // firebase actions
    'listenToProfile': {},
    'listenToPost': {},
    'listenToPosts': {},
    'stopListeningToProfile': {},
    'stopListeningToPosts': {},
    'stopListeningToPost': {},
    // error actions
    'loginError': {},
    // ui actions
    'showModal': {},
    'hideModal': {},
    'goToPost': {}
});

/* User Actions
===============================*/

function updateProfile(userId) {
    usersRef.child(userId).on('value', function(profile) {
        Actions.updateProfile(userId, profile.val());
    });
}

// triggered by auth changes
ref.onAuth(function(authData) {
    if (!authData) {
        // logging out
        usersRef.off();
        Actions.logout.completed();
    } else {
        // called when reloading the page
        // while authentication still active
        updateProfile(authData.uid);
    }
});

Actions.login.listen(function(user, username) {
    // username only provided when registering a new user
    // used to create a user profile
    ref.authWithPassword(user, function(error, authData) {
        if (error !== null) {
            Actions.loginError(error.code);
        } else {
            // sucessful login
            var userId = authData.uid;
            if (username) {
                // new user logging in for first time
                var email = authData.password.email;
                Actions.createProfile(userId, username, email);
            } else {
                // returning user
                updateProfile(userId);
            }
        }
    });
});

Actions.logout.listen(function() {
    // because of firebase API, callback must
    // be declared via ref.onAuth() (see above)
    ref.unauth();
});

Actions.register.listen(function(username, loginData) {

    var checkForUsername = Promise.promisify(function(name, cb) {
        usersRef.orderByChild('username').equalTo(name).once('value', function(user) {
            cb(!!user.val());
        });
    });

    if (!username) {
        // no username provided
        Actions.loginError('NO_USERNAME');
        return;
    }

    // check if username is already taken
    checkForUsername(username)
        .then(function(usernameTaken) {
            if (usernameTaken) {
                Actions.loginError('USERNAME_TAKEN');
            } else {
                ref.createUser(loginData, function(error) {
                    if (error) {
                        // error during user creation
                        Actions.loginError(error.code);
                    } else {
                        // user successfully created
                        Actions.login(loginData, username);
                    }
                });
            }
        });
});

Actions.createProfile.listen(function(uid, username, email) {
    var md5hash = hash.update(email).digest('hex');
    var profile = {
        username: username,
        md5hash: md5hash,
        upvoted: {}
    };
    usersRef.child(uid).set(profile, function(error) {
        if (error === null) {
            // user profile successfully created
            Actions.updateProfile(uid, profile);
        }
    });
});


/* Post Actions
===============================*/

Actions.submitPost.listen(function(post) {
    var newPostRef = postsRef.push(post, function(error) {
        if (error) {
            this.failed(error.code);
        } else {
            this.completed(newPostRef.key());
        }
    });
});

Actions.deletePost.preEmit = function(postId) {
    postsRef.child(postId).remove();
};

Actions.upvotePost.preEmit = function(userId, postId) {
    postsRef.child(postId).child('upvotes').transaction(function(curr) {
        return (curr || 0) + 1;
    }, function(error, success) {
        if (success) {
            // register upvote in user's profile
            usersRef.child(userId).child('upvoted').child(postId).set(true);
        }
    });
};

Actions.downvotePost.preEmit = function(userId, postId) {
    postsRef.child(postId).child('upvotes').transaction(function(curr) {
        return curr - 1;
    }, function(error, success) {
        if (success) {
            // register upvote in user's profile
            usersRef.child(userId).child('upvoted').child(postId).remove();
        }
    });
};

/* Comment Actions
===============================*/

Actions.updateCommentCount.preEmit = function(postId, n) {
    // updates comment count on post
    postsRef.child(postId).child('commentCount').transaction(function(curr) {
        return curr + n;
    });
};

Actions.upvoteComment.preEmit = function(userId, commentId) {
    commentsRef.child(commentId).child('upvotes').transaction(function(curr) {
        return (curr || 0) + 1;
    }, function(error, success) {
        if (success) {
            // register upvote in user's profile
            usersRef.child(userId).child('upvoted').child(commentId).set(true);
        }
    });
};

Actions.downvoteComment.preEmit = function(userId, commentId) {
    commentsRef.child(commentId).child('upvotes').transaction(function(curr) {
        return curr - 1;
    }, function(error, success) {
        if (success) {
            // register upvote in user's profile
            usersRef.child(userId).child('upvoted').child(commentId).remove();
        }
    });
};

Actions.addComment.preEmit = function(comment) {
    commentsRef.push(comment, function(error) {
        if (error === null) {
            Actions.updateCommentCount(comment.postId, 1);
        }
    });
};

Actions.deleteComment.preEmit = function(commentId, postId) {
    commentsRef.child(commentId).remove(function(error) {
        if (error === null) {
            Actions.updateCommentCount(postId, -1);
        }
    });
};

module.exports = Actions;
