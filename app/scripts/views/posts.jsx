'use strict';

var React = require('react/addons');

var Reflux = require('reflux');
var postStore = require('../stores/postStore');

var Post = require('../components/post');


var Posts = React.createClass({

    mixins: [Reflux.connect(postStore, 'posts')],

	getInitialState: function () {
		return {
			posts: false
		};
	},

	render: function() {

		if (!this.state.posts) {
			return <div />;
		}

		// var byUpvotes = function (a, b) {
		// 	return b.upvotes - a.upvotes;
		// };

		var posts = this.state.posts;

		var postsArr = [];
		var keys = Object.keys(posts);

		keys.forEach(function (postId) {
			var post = posts[postId];
			postsArr.push(
				<Post post={ post }
					postId={ postId }
					key={ postId } />
			);
		});

		return (
			<div className="content inner">
				{ postsArr }
			</div>
		);
	}

});

module.exports = Posts;