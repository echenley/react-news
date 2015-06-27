'use strict';

import Promise from 'bluebird';
import Reflux from 'reflux';
import Firebase from 'firebase';

const baseRef = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
const commentsRef = baseRef.child('comments');
const postsRef = baseRef.child('posts');
const usersRef = baseRef.child('users');

const Actions = Reflux.createActions({
    // user actions
    'login': {},
    'logout': {},
    'register': {},
    'createProfile': {},
    'updateProfile': {},
    // post actions
    'upvotePost': { asyncResult: true },
    'downvotePost': { asyncResult: true },
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
    'watchProfile': {},
    'watchPost': {},
    'watchPosts': {},
    'stopWatchingProfile': {},
    'stopWatchingPost': {},
    'stopWatchingPosts': {},
    // error actions
    'loginError': {},
    'clearError': {},
    // ui actions
    'showModal': {},
    'hideModal': {},
    'goToPost': {}
});

/* User Actions
===============================*/

Actions.login.listen(function(loginData) {
    baseRef.authWithPassword(loginData, error => (
        error && Actions.loginError(error.code)
    ));
});

function checkForUsername(newName) {
    // checks whether username is entered/isn't already taken
    return new Promise(function(resolve, reject) {
        if (!newName) {
            reject({ code: 'NO_USERNAME' });
        }

        // check if taken
        usersRef.orderByChild('username').equalTo(newName).once('value', user => (
            user.val() ? reject({ code: 'USERNAME_TAKEN' }) : resolve()
        ));
    });
}

Actions.register.listen(function(username, loginData) {
    checkForUsername(username)
        .then(function() {
            // username is available
            baseRef.createUser(loginData, function(error, userData) {
                if (error) { return error; }

                // user successfully created
                let email = userData.password.email;

                Actions.createProfile(userData.uid, username, email);
                Actions.login(loginData);
            });
        })
        // error during user creation
        .catch(error => Actions.loginError(error.code));
});


/* Post Actions
===============================*/

function updatePostUpvotes(postId, n) {
    console.log('upvoting post', n);
    postsRef.child(postId + '/upvotes').transaction(curr => (curr || 0) + n);
}

Actions.submitPost.listen(function(post) {
    var newPostRef = postsRef.push(post, error => (
        error ? this.failed(error) : this.completed(newPostRef.key())
    ));
});

Actions.deletePost.listen(function(postId) {
    postsRef.child(postId).remove();
});

/*
    I debated for a while here about whether it's okay to trust that these
    callbacks would work to keep things in sync. I looked at Firebase Util
    (still very beta as of June 2015) and Firebase Multi Write but decided
    that the extra dependencies were probably overkill for this project. If
    you need more guarantees that the data will stay in sync, check them out:

    https://github.com/firebase/firebase-util
    https://github.com/katowulf/firebase-multi-write
*/

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
===============================*/

function updateCommentUpvotes(commentId, n) {
    postsRef.child(commentId + '/upvotes').transaction(curr => (curr || 0) + n);
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

Actions.showModal.listen(function(modalType, errorType) {
    if (errorType) {
        Actions.loginError(errorType);
    } else {
        Actions.clearError();
    }
});

export default Actions;
