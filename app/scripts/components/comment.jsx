'use strict';

var React = require('react/addons');
var commentActions = require('../actions/commentActions');

var abbreviateNumber = require('../mixins/abbreviateNumber');
var Link = require('react-router').Link;

var Comment = React.createClass({

    mixins: [abbreviateNumber],

    upvote: function (userId, postId, commentId, alreadyUpvoted) {
        // add upvote to comment
        commentActions.upvote(userId, postId, commentId, alreadyUpvoted);
    },

    render: function() {
        var comment = this.props.comment;
        var commentId = this.props.commentId;
        var postId = this.props.postId;

        var user = this.props.user;
        var signedIn = !!user;
        var alreadyUpvoted = user.profile.upvoted ? user.profile.upvoted[commentId] : false;

        var upvoteId = 'upvote' + commentId;
        var upvotes = comment.upvotes ? this.abbreviateNumber(comment.upvotes) : 0;

        return (
            <div className="comment cf">
                <div className="comment-text">
                    { comment.text }
                </div>
                <div className="comment-info">
                    Posted by <Link to="profile" params={{ userId: comment.creatorUID }}>{ comment.creator }</Link>
                    <div className="float-right">
                        <input
                            className="upvote hidden"
                            type="checkbox"
                            checked={ signedIn && alreadyUpvoted }
                            disabled={ !signedIn }
                            id={ upvoteId }
                            onChange={ this.upvote.bind(this, user.uid, postId, commentId, alreadyUpvoted) } />
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