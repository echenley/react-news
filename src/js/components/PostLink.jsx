'use strict';

import React, { PropTypes } from 'react';
import hostNameFromUrl from '../util/hostNameFromUrl';

const PostLink = ({ url, title }) => (
    <div className="post-link">
        <a className="post-title" href={ url }>{ title }</a>
        <span className="hostname">
            (<a href={ url }>{ hostNameFromUrl(url) }</a>)
        </span>
    </div>
);

PostLink.PropTypes = {
    post: PropTypes.object
};

export default PostLink;
