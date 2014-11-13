'use strict';

var Reflux = require('reflux');

var Firebase = require('firebase');
var postsRef = new Firebase('https://resplendent-fire-4810.firebaseio.com/posts');

var historyActions = require('./historyActions');
var userActions = require('./userActions');

var postActions = Reflux.createActions([
	'upvote',
	'submitPost'
]);

postActions.submitPost.preEmit = function (post) {
	// postsRef.push() returns reference to post
	var postRef = postsRef.push(post, function (error) {
        if (error === null) {
            // add post to user's history
            var postId = postRef.key();
            historyActions.addPost(post.creatorUID, postId);
        }
	});
};

postActions.upvote.preEmit = function (userId, postId, alreadyUpvoted) {
    postsRef.child(postId).child('upvotes').transaction(function (curr) {
        curr = curr || 0;
        var n = alreadyUpvoted ? -1 : 1;
        return curr + n;
    }, function (error, success) {
    	if (success) {
			// add comment to user's list of upvoted items
			userActions.upvoteItem(userId, postId, alreadyUpvoted);
    	}
    });
};

module.exports = postActions;
