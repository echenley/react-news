'use strict';

import Promise from 'bluebird';
import Reflux from 'reflux';
import Firebase from 'firebase';

const baseRef = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
const commentsRef = baseRef.child('comments');
const postsRef = baseRef.child('posts');
const usersRef = baseRef.child('users');

// used to create email hash for gravatar
const hash = require('crypto').createHash('md5');

const Actions = Reflux.createActions({
    // user actions
    'login': {},
    'logout': {},
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
    'watchPost': {},
    'watchPosts': {},
    'watchProfile': {},
    'stopWatchingPost': {},
    'stopWatchingPosts': {},
    'stopWatchingProfile': {},
    // error actions
    'loginError': {},
    'clearError': {},
    // ui actions
    'showModal': {},
    'hideModal': {},
    'goToPost': {}
});

/* User Actions
=============================== */

Actions.login.listen(function(loginData) {
    baseRef.authWithPassword(loginData, error => (
        error && Actions.loginError(error.code)
    ));
});

// this registration code could probably be cleaned up some

function checkForUsername(newName) {
    // checks if username is blank/is already taken
    return new Promise(function(resolve, reject) {
        if (!newName) {
            return reject({ code: 'NO_USERNAME' });
        }

        // check if taken
        usersRef.orderByChild('username').equalTo(newName).once('value', user => (
            user.val()
                ? reject({ code: 'USERNAME_TAKEN' })
                : resolve()
        ));
    });
}

function createUser(username, loginData) {

    let profile = {
        username: username,
        md5hash: hash.update(loginData.email).digest('hex'),
        upvoted: {}
    };

    baseRef.createUser(loginData, function(error, userData) {
        if (error) {
            // email taken, other login errors
            return Actions.loginError(error.code);
        }

        // user successfully created
        // now create user profile and log them in
        usersRef.child(userData.uid).set(profile, err => err || Actions.login(loginData));
    });
}

Actions.register.listen(function(username, loginData) {
    checkForUsername(username)
        // username is available
        .then(() => createUser(username, loginData))
        // username is taken
        .catch(error => Actions.loginError(error.code));
});


/* Post Actions
=============================== */

Actions.submitPost.listen(function(post) {
    let newPostRef = postsRef.push(post, error => (
        error ? this.failed(error) : this.completed(newPostRef.key())
    ));
});

Actions.deletePost.listen(function(postId) {
    postsRef.child(postId).set({
        isDeleted: true
    });
});

/*
    I debated for a while here about whether it's okay to trust these
    callbacks to keep things in sync. I looked at Firebase Util (still very
    beta as of June 2015) and Firebase Multi Write but decided that the extra
    dependencies were probably overkill for this project. If you need more
    guarantees that the data will stay in sync, check them out:

    https://github.com/firebase/firebase-util
    https://github.com/katowulf/firebase-multi-write
*/

function updatePostUpvotes(postId, n) {
    postsRef.child(postId + '/upvotes').transaction(curr => (curr || 0) + n);
}

Actions.upvotePost.listen(function(userId, postId) {
    // register postId in user's profile
    usersRef.child(userId + '/upvoted/' + postId).set(true, function(error) {
        if (error) { return; }
        // increment post's upvotes
        updatePostUpvotes(postId, 1);
    });
});

Actions.downvotePost.listen(function(userId, postId) {
    // remove upvote in user's profile
    usersRef.child(userId + '/upvoted/' + postId).remove(function(error) {
        if (error) { return; }
        // increment post's upvotes
        updatePostUpvotes(postId, -1);
    });
});

/* Comment Actions
=============================== */

function updateCommentUpvotes(commentId, n) {
    commentsRef.child(commentId + '/upvotes').transaction(curr => (curr || 0) + n);
}

Actions.upvoteComment.listen(function(userId, commentId) {
    // register upvote in user's profile
    usersRef.child(userId + '/upvoted/' + commentId).set(true, function(error) {
        if (error) { return; }
        updateCommentUpvotes(commentId, 1);
    });
});

Actions.downvoteComment.listen(function(userId, commentId) {
    usersRef.child(userId + '/upvoted/' + commentId).remove(function(error) {
        if (error) { return; }
        updateCommentUpvotes(commentId, -1);
    });
});

function updateCommentCount(postId, n) {
    // updates comment count on post
    postsRef.child(postId + '/commentCount').transaction(curr => (curr || 0) + n);
}

Actions.addComment.listen(function(comment) {
    commentsRef.push(comment, function(error) {
        if (error) { return; }
        updateCommentCount(comment.postId, 1);
    });
});

Actions.deleteComment.listen(function(commentId, postId) {
    commentsRef.child(commentId).remove(function(error) {
        if (error) { return; }
        updateCommentCount(postId, -1);
    });
});

Actions.showModal.preEmit = function(modalType, errorType) {
    if (errorType) {
        Actions.loginError(errorType);
    } else {
        Actions.clearError();
    }
};

export default Actions;
