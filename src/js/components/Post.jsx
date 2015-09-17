'use strict';

import React, { PropTypes } from 'react/addons';
import PostLink from './PostLink';
import PostInfo from './PostInfo';

const Post = React.createClass({

    propTypes: {
        user: PropTypes.object,
        post: PropTypes.object
    },

    render() {
        const { user, post } = this.props;

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

        return (
            <div className="post">
                <PostLink post={ post } />
                <PostInfo post={ post } user={ user } />
            </div>
        );
    }
});

export default Post;
