'use strict';

var React = require('react/addons');

// var Reflux = require('reflux');
// var Action = require('../actions/actions');
// var Store = require('../stores/store');
// var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Comment = React.createClass({

	render: function() {
		var comment = this.props.comment;
		// var signedIn = !!this.props.user;
		// var upvoteId = 'upvote' + postId;
		// var upvotes = this.abbreviateNumber(post.upvotes);

		return (
			<div className="comment cf">
				<div className="comment-body">
					{ comment.text }
				</div>
				<div className="comment-info">
					{ comment.creator }
				</div>
			</div>
		);
	}

});

module.exports = Comment;