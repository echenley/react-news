'use strict';

import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import pluralize from '../util/pluralize';

const CommentsLink = ({ postId, commentCount }) => (
    <span className="post-info-item">
        <Link to={ `/post/${postId}` }>
            { pluralize(commentCount, 'comment') }
        </Link>
    </span>
);

CommentsLink.PropTypes = {
    postId: PropTypes.string,
    commentCount: PropTypes.number
};

export default CommentsLink;
