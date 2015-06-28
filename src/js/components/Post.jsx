'use strict';

import React from 'react/addons';

import Actions from '../actions/Actions';

import { Link } from 'react-router';
import Upvote from './Upvote';

import abbreviateNumber from '../util/abbreviateNumber';
import pluralize from '../util/pluralize';
import hostNameFromUrl from '../util/hostNameFromUrl';
import timeAgo from '../util/timeAgo';

const Post = React.createClass({

    propTypes: {
        user: React.PropTypes.object,
        post: React.PropTypes.object
    },

    render() {
        let user = this.props.user;
        let userUpvoted = user.profile.upvoted || {};
        let post = this.props.post;
        let commentCount = post.commentCount || 0;
        let upvoteActions = {
            upvote: Actions.upvotePost,
            downvote: Actions.downvotePost
        };

        if (post.isDeleted) {
            // post doesn't exist
            return (
                <div className="post cf">
                    <div className="post-link">
                        [deleted]
                    </div>
                </div>
            );
        }

        // add delete option if creator is logged in
        let deleteOption = user.uid !== post.creatorUID ? '' : (
            <span className="delete post-info-item">
                <a onClick={ () => Actions.deletePost(post.id) }>delete</a>
            </span>
        );

        return (
            <div className="post">
                <div className="post-link">
                    <a className="post-title" href={ post.url }>{ post.title }</a>
                    <span className="hostname">
                        (<a href={ post.url }>{ hostNameFromUrl(post.url) }</a>)
                    </span>
                </div>
                <div className="post-info">
                    <div className="posted-by">
                        <Upvote
                            upvoteActions={ upvoteActions }
                            user={ user }
                            itemId={ post.id }
                            isUpvoted={ !!userUpvoted[post.id] }
                            upvotes={ post.upvotes ? abbreviateNumber(post.upvotes) : '0' }
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
                </div>
            </div>
        );
    }
});

export default Post;
