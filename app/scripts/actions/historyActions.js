'use strict';

var Reflux = require('reflux');

var Firebase = require('firebase');
var historyRef = new Firebase('https://resplendent-fire-4810.firebaseio.com/user_history');

var historyActions = Reflux.createActions([
	'addPost',
	'addComment',
	'setFirebaseCallback',
	'removeFirebaseCallback'
]);

historyActions.addPost.preEmit = function (userId, postId) {
    historyRef.child(userId).child('posts').child(postId).set(true);
};

module.exports = historyActions;