'use strict';

// actions
var actions = require('../actions/actions');

// components
var Link = require('react-router').Link;
var Upvote = require('./upvote');

var Comment = React.createClass({

    mixins: [
        require('../mixins/abbreviateNumber'),
        require('../mixins/timeAgo')
    ],

    render: function() {
        var user = this.props.user;
        var comment = this.props.comment;
        var showPostTitle = this.props.showPostTitle;

        var postLink = '';
        if (showPostTitle) {
            postLink = (
                <span className="post-info-item">
                    <Link to="post" params={{ postId: comment.postId }}>{ comment.postTitle }</Link>
                </span>
            );
        }

        var deleteOption = '';
        if (user.uid === comment.creatorUID) {   
            deleteOption = (
                <span className="delete post-info-item">
                    <a onClick={ actions.deleteComment.bind(this, comment.id, comment.postId) }>delete</a>
                </span>
            );
        }

        var upvoteActions = {
            upvote: actions.upvoteComment,
            downvote: actions.downvoteComment
        };

        return (
            <div className="comment cf">
                <div className="comment-text">
                    { comment.text }
                </div>
                <div className="comment-info">
		            <div className="posted-by float-left">
                        <Upvote
                            upvoteActions={ upvoteActions }
                            user={ user }
                            itemId={ comment.id }
                            upvotes={ comment.upvotes ? this.abbreviateNumber(comment.upvotes) : 0 } />
                        <span className="post-info-item">
                            <Link to="profile" params={{ username: comment.creator }}>{ comment.creator }</Link>
                        </span>
                        <span className="post-info-item">
                            { this.timeAgo(comment.time) }
                        </span>
                        { postLink }
                        { deleteOption }
		            </div>
	            </div>
            </div>
        );
    }

});

module.exports = Comment;