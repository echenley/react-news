'use strict';

var Reflux = require('reflux');

var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
var commentsRef = ref.child('comments');
var postsRef = ref.child('posts');

var userActions = require('./userActions');

var commentActions = Reflux.createActions([
    'upvote',
    'getComments',
    'addComment',
    'listenToComments',
    'stopListening'
]);

function updateCommentCount(postId, n) {
    // updates comment count on post
    postsRef.child(postId).child('commentCount').transaction(function(curr) {
        return curr + n;
    });
}

commentActions.upvote.preEmit = function (userId, commentId, alreadyUpvoted) {
    commentsRef.child(commentId).child('upvotes').transaction(function (curr) {
        curr = curr || 0;
        var n = alreadyUpvoted ? -1 : 1;
        return curr + n;
    }, function (error, success) {
        if (success) {
            // add comment to user's list of upvoted items
            userActions.upvoteItem(userId, commentId, alreadyUpvoted);
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