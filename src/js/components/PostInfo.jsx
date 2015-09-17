'use strict';

import React, { PropTypes } from 'react/addons';
import { Link } from 'react-router';

import Actions from '../actions/Actions';

import Upvote from './Upvote';

import pluralize from '../util/pluralize';
import timeAgo from '../util/timeAgo';

const PostLink = React.createClass({

    propTypes: {
        user: PropTypes.object,
        post: PropTypes.object
    },

    render() {
        const { user, post } = this.props;

        let userUpvoted = user.upvoted || {};

        let commentCount = post.commentCount || 0;
        let upvoteActions = {
            upvote: Actions.upvotePost,
            downvote: Actions.downvotePost
        };

        // add delete option if creator is logged in
        let deleteOption = user.uid === post.creatorUID && (
            <span className="delete post-info-item">
                <a onClick={ () => Actions.deletePost(post) }>delete</a>
            </span>
        );

        return (
            <div className="post-info">
                <Upvote
                    upvoteActions={ upvoteActions }
                    user={ user }
                    itemId={ post.id }
                    isUpvoted={ !!userUpvoted[post.id] }
                    upvotes={ post.upvotes || 0 }
                />
                <span className="post-info-item">
                    <Link to={ `/user/${post.creator}` }>{ post.creator }</Link>
                </span>
                <span className="post-info-item">
                    { timeAgo(post.time) }
                </span>
                <span className="post-info-item">
                    <Link to={ `/post/${post.id}` }>
                        { pluralize(commentCount, 'comment') }
                    </Link>
                </span>
                { deleteOption }
            </div>
        );
    }
});

export default PostLink;
