'use strict';

var React = require('react/addons');
var commentActions = require('../actions/commentActions');

var abbreviateNumber = require('../mixins/abbreviateNumber');
var Link = require('react-router').Link;

var Comment = React.createClass({

    mixins: [abbreviateNumber],

    upvote: function (userId, commentId, alreadyUpvoted) {
        // add upvote to comment
        commentActions.upvote(userId, commentId, alreadyUpvoted);
    },

    render: function() {
        var comment = this.props.comment;

        var user = this.props.user;
        var signedIn = !!user.uid;
        var alreadyUpvoted = user.profile.upvoted ? user.profile.upvoted[comment.id] : false;

        var upvoteId = 'upvote' + comment.id;
        var upvotes = comment.upvotes ? this.abbreviateNumber(comment.upvotes) : 0;

        return (
            <div className="comment cf">
                <div className="comment-text">
                    { comment.text }
                </div>
                <div className="comment-info">
		            <div className="posted-by float-left">
		                Posted by <Link to="profile" params={{ userId: comment.creatorUID }}>{ comment.creator }</Link>
		            </div>
		            <div className="float-right">
		                <input
		                    className="upvote hidden"
		                    type="checkbox"
		                    checked={ signedIn && alreadyUpvoted }
		                    disabled={ !signedIn }
		                    id={ upvoteId }
		                    onChange={ this.upvote.bind(this, user.uid, comment.id, alreadyUpvoted) } />
		                <label htmlFor={ upvoteId } className="pointer">
		                    { upvotes } <i className="fa fa-arrow-up"></i>
		                </label>
		            </div>
	            </div>
            </div>
        );
    }

});

module.exports = Comment;