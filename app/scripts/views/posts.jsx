'use strict';

var $ = jQuery;
var React = require('react/addons');

var Reflux = require('reflux');
var postStore = require('../stores/postStore');
var userStore = require('../stores/userStore');

// var userActions = require('../actions/userActions');

var Post = require('../components/post');

var Posts = React.createClass({

    mixins: [
    	Reflux.connect(userStore, 'user'),
    	Reflux.connect(postStore, 'posts')
    ],

	getInitialState: function () {
		return {
			user: false,
			posts: {}
		};
	},

	render: function() {
		var posts = this.state.posts;
		var user = this.state.user;

		// if state is unresolved, return empty div
		if ($.isEmptyObject(posts)) {
			return false;
		}

		// var byUpvotes = function (a, b) {
		// 	return b.upvotes - a.upvotes;
		// };


		var postsArr = [];
		var keys = Object.keys(posts);

		keys.forEach(function (postId) {
			var post = posts[postId];
			postsArr.push(
				<Post post={ post }
					user={ user }
					postId={ postId }
					key={ postId } />
			);
		});

		return (
			<div className="content inner">
				{ postsArr.reverse() }
			</div>
		);
	}

});

module.exports = Posts;