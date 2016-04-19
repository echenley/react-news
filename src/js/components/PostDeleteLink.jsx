'use strict';

import React, { PropTypes } from 'react';
import Actions from '../actions/Actions';

const PostDeleteLink = ({ post }) => (
    <span className="delete post-info-item">
        <a onClick={ () => Actions.deletePost(post) }>delete</a>
    </span>
);

PostDeleteLink.propTypes = {
    post: PropTypes.object
};

export default PostDeleteLink;
