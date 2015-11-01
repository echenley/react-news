'use strict';

import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import pluralize from '../util/pluralize';

const CommentsLink = ({ id, commentCount }) => (
    <span className="post-info-item">
        <Link to={ `/post/${id}` }>
            { pluralize(commentCount, 'comment') }
        </Link>
    </span>
);

CommentsLink.propTypes = {
    id: PropTypes.string,
    commentCount: PropTypes.number
};

export default CommentsLink;
