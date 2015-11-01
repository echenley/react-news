'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const PostCreatorLink = ({ creator }) => (
    <span className="post-info-item">
        <Link to={ `/user/${creator}` }>{ creator }</Link>
    </span>
);

PostCreatorLink.propTypes = {
    creator: PropTypes.string
};

export default PostCreatorLink;
