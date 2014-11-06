'use strict';

var Reflux = require('reflux');

var userStore = require('../stores/userStore');

var postActions = {};

postActions.upvote = Reflux.createAction({
	shouldEmit: function () {
		return userStore.isLoggedIn();
	}
});

postActions.submitPost = Reflux.createAction();

module.exports = postActions;
