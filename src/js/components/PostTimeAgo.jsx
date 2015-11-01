'use strict';

import React, { PropTypes } from 'react';
import timeAgo from '../util/timeAgo';

const PostTimeAgo = ({ time }) => (
    <span className="post-info-item">
        { timeAgo(time) }
    </span>
);

PostTimeAgo.PropTypes = {
    time: PropTypes.string
};

export default PostTimeAgo;
