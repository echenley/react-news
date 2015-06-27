'use strict';

import React from 'react/addons';
import Actions from '../actions/Actions';

import { Link } from 'react-router';
import Upvote from './Upvote';
import abbreviateNumber from '../util/abbreviateNumber';
import timeAgo from '../util/timeAgo';

const Comment = React.createClass({

    propTypes: {
        user: React.PropTypes.object,
        comment: React.PropTypes.object,
        showPostTitle: React.PropTypes.bool
    },

    render() {
        var user = this.props.user;
        var comment = this.props.comment;
        var showPostTitle = this.props.showPostTitle;

        var postLink = showPostTitle && (
            <span className="post-info-item">
                <Link to="post" params={{ postId: comment.postId }}>{ comment.postTitle }</Link>
            </span>
        );

        var deleteOption = user.uid === comment.creatorUID && (
            <span className="delete post-info-item">
                <a onClick={ Actions.deleteComment.bind(this, comment.id, comment.postId) }>delete</a>
            </span>
        );

        var upvoteActions = {
            upvote: Actions.upvoteComment,
            downvote: Actions.downvoteComment
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
                            upvotes={ comment.upvotes ? abbreviateNumber(comment.upvotes) : 0 }
                        />

                        <span className="post-info-item">
                            <Link to="profile" params={{ username: comment.creator }}>
                                { comment.creator }
                            </Link>
                        </span>

                        <span className="post-info-item">
                            { timeAgo(comment.time) }
                        </span>

                        { postLink }

                        { deleteOption }

                    </div>
                </div>
            </div>
        );
    }

});

export default Comment;
