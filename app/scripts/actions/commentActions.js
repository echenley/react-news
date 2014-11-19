'use strict';

var Reflux = require('reflux');

var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
var commentsRef = ref.child('comments');
var postsRef = ref.child('posts');

var userActions = require('./userActions');

var commentActions = Reflux.createActions([
    'upvote',
    'downvote',
    'getComments',
    'addComment',
    'listenToComments',
    'listenToUser',
    'stopListening'
]);

function updateCommentCount(postId, n) {
    // updates comment count on post
    postsRef.child(postId).child('commentCount').transaction(function(curr) {
        return curr + n;
    });
}

commentActions.upvote.preEmit = function (userId, commentId) {
    commentsRef.child(commentId).child('upvotes').transaction(function (curr) {
        return (curr || 0) + 1;
    }, function (error, success) {
        if (success) {
            // add comment to user's list of upvoted items
            userActions.upvoteItem(userId, commentId);
        }
    });
};

commentActions.downvote.preEmit = function (userId, commentId) {
    commentsRef.child(commentId).child('upvotes').transaction(function (curr) {
        return curr - 1;
    }, function (error, success) {
        if (success) {
            // add comment to user's list of upvoted items
            userActions.downvoteItem(userId, commentId);
        }
    });
};

commentActions.addComment.preEmit = function (comment) {
    commentsRef.push(comment, function (error) {
        if (error === null) {
            updateCommentCount(comment.postId, 1);
        }
    }.bind(this));
};

module.exports = commentActions;