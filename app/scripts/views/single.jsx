'use strict';

var React = require('react/addons');

var Reflux = require('reflux');

var postStore = require('../stores/postStore');
var commentStore = require('../stores/commentStore');
var commentActions = require('../actions/commentActions');

var Post = require('../components/post');
var Comment = require('../components/comment');


var SinglePost = React.createClass({

    mixins: [Reflux.connect(commentStore, 'comments'), Reflux.connect(postStore, 'posts')],

	getInitialState: function () {
		return {
			posts: false,
			comments: {}
		};
	},

    // statics: {
	   //  willTransitionTo: function(transition, params) {
	   //  	console.log(transition, params);
	   //  	transition.wait(function () {
	    		
	   //  	});
	   //  }
    // },

	componentWillMount: function () {
		commentActions.getComments(this.props.params.postId);
	},

	render: function() {

		// if state is unresolved, return empty div
		if (!this.state.posts) {
			return <div />;
		}

		var user = this.state.user;
		var posts = this.state.posts;
		var postId = this.props.params.postId;
		var post = posts[postId];

		var commentsArr = [];
		var comments = this.state.comments;

		if (comments) {
			var keys = Object.keys(comments);

			keys.forEach(function (commentId) {
				var comment = comments[commentId];
				commentsArr.push(
					<Comment comment={ comment }
						key={ commentId } />
				);
			});
		}

		return (
			<div className="content inner">
				<Post post={ post }
					user={ user }
					postId={ postId }
					key={ postId } />
				<div className="comments">
					<h2>Comments</h2>
					{ commentsArr }
				</div>
			</div>
		);
	}

});

module.exports = SinglePost;