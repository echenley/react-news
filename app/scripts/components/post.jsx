'use strict';

var React = require('react/addons');

var postActions = require('../actions/postActions');

var Router = require('react-router');
var Link = Router.Link;

var Post = React.createClass({

	upvote: function (postId) {
		postActions.upvote(postId);
	},

	hostnameFromUrl: function (str) {
		var url = document.createElement('a');
		url.href = str;
		return url.hostname;
	},

	abbreviateNumber: function (value) {
		// Abbreviates numbers >= 1K
		// 100050 => 100K
	    var newValue = value;
	    if (value >= 1000) {
	        var suffixes = ["", "K", "M", "B","T"];
	        var suffixNum = Math.floor( (""+value).length/3 );
	        var shortValue = '';
	        for (var precision = 2; precision >= 1; precision--) {
	            shortValue = parseFloat( (suffixNum !== 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
	            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
	            if (dotLessShortValue.length <= 2) { break; }
	        }
	        if (shortValue % 1 !== 0) { shortValue = shortValue.toFixed(1); }
	        newValue = shortValue + suffixes[suffixNum];
	    }
	    return newValue;
	},

	render: function() {
		var postId = this.props.postId;
		var post = this.props.post;
		// var signedIn = !!this.props.user;
		// var upvoteId = 'upvote' + postId;
		// var upvotes = this.abbreviateNumber(post.upvotes);
		var commentCount = this.abbreviateNumber(post.commentCount);

		return (
			<div className="post cf">
				<div className="post-title">
					<a href={ post.url }>{ post.title }</a>
					<span className="hostname">
						(<a href={ post.url }>{ this.hostnameFromUrl(post.url) }</a>)
					</span>
				</div>
				<div className="post-info">
					<div className="float-right">
						{/*<input
							className="upvote hidden"
							type="checkbox"
							checked={ signedIn && user.upvoted[postId] }
							id={ upvoteId }
							onChange={ this.upvote.bind(this, postId) } />
						<label htmlFor={ upvoteId } className="pointer">
							{ upvotes } <i className="fa fa-arrow-up"></i>
						</label> */}
						<Link to="post" params={{ postId: postId }} className="comments-link no-underline">
							{ commentCount } <i className="fa fa-comments"></i>
						</Link>
					</div>
				</div>
			</div>
		);
	}

});

module.exports = Post;