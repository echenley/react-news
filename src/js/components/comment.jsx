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
        let user = this.props.user;
        let userUpvoted = user.profile.upvoted || {};
        let comment = this.props.comment;
        let showPostTitle = this.props.showPostTitle;

        let postLink = showPostTitle && (
            <span className="post-info-item">
                <Link to={ `/post/${comment.postId}` }>{ comment.postTitle }</Link>
            </span>
        );

        let deleteOption = user.uid === comment.creatorUID && (
            <span className="delete post-info-item">
                <a onClick={ Actions.deleteComment.bind(this, comment.id, comment.postId) }>delete</a>
            </span>
        );

        let upvoteActions = {
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
                            upvotes={ comment.upvotes ? abbreviateNumber(comment.upvotes) : '0' }
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
