'use strict';

import React, { PropTypes } from 'react/addons';
import hostNameFromUrl from '../util/hostNameFromUrl';

const PostLink = React.createClass({

    propTypes: {
        post: PropTypes.object
    },

    render() {
        const { url, title } = this.props.post;

        return (
            <div className="post-link">
                <a className="post-title" href={ url }>{ title }</a>
                <span className="hostname">
                    (<a href={ url }>{ hostNameFromUrl(url) }</a>)
                </span>
            </div>
        );
    }
});

export default PostLink;
