'use strict';

var Reflux = require('reflux');

var Firebase = require('firebase');
var postsRef = new Firebase('https://resplendent-fire-4810.firebaseio.com/posts');

var userActions = require('./userActions');
// var commentActions = require('./commentActions');

var postActions = Reflux.createActions([
    'upvote',
    'downvote',
    'submitPost',
    'listenToAll',
    'listenToUser',
    'listenToSingle',
    'stopListening'
]);

postActions.submitPost.preEmit = function (post) {
    // postsRef.push() returns reference to post
    postsRef.push(post);
};

postActions.upvote.preEmit = function (userId, postId) {
    postsRef.child(postId).child('upvotes').transaction(function (curr) {
        return (curr || 0) + 1;
    }, function (error, success) {
        if (success) {
            // add comment to user's list of upvoted items
            userActions.upvoteItem(userId, postId);
        }
    });
};

postActions.downvote.preEmit = function (userId, postId) {
    postsRef.child(postId).child('upvotes').transaction(function (curr) {
        return curr - 1;
    }, function (error, success) {
        if (success) {
            // add comment to user's list of upvoted items
            userActions.downvoteItem(userId, postId);
        }
    });
};


module.exports = postActions;
