'use strict';

import React, { PropTypes } from 'react';
import Actions from '../actions/Actions';

import { Link } from 'react-router';
import Upvote from './Upvote';
import timeAgo from '../util/timeAgo';

const Comment = React.createClass({

    propTypes: {
        user: PropTypes.object,
        comment: PropTypes.object,
        showPostTitle: PropTypes.bool
    },

    render() {
        const { user, comment, showPostTitle } = this.props;
        const userUpvoted = user.upvoted || {};

        const postLink = showPostTitle && (
            <span className="post-info-item post-link">
                <Link to={ `/post/${comment.postId}` }>{ comment.postTitle }</Link>
            </span>
        );

        const deleteOption = user.uid === comment.creatorUID && (
            <span className="delete post-info-item">
                <a onClick={ () => Actions.deleteComment(comment) }>delete</a>
            </span>
        );

        const upvoteActions = {
            upvote: Actions.upvoteComment,
            downvote: Actions.downvoteComment
        };

        return (
            <div className="comment cf">
                <div className="comment-text">
                    { comment.text }
                </div>

                <div className="comment-info">
                    <div className="posted-by">
                        <Upvote
                            upvoteActions={ upvoteActions }
                            user={ user }
                            itemId={ comment.id }
                            isUpvoted={ !!userUpvoted[comment.id] }
                            upvotes={ comment.upvotes || 0 }
                        />
                        <span className="post-info-item">
                            <Link to={ `/user/${comment.creator}` }>
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
