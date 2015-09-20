'use strict';

import React, { PropTypes } from 'react/addons';
import Link from 'react-router/lib/Link';

const ProfileLink = React.createClass({
    propTypes: {
        user: PropTypes.object
    },

    render() {
        const { username, md5hash } = this.props.user;
        const gravatarURI = 'http://www.gravatar.com/avatar/' + md5hash + '?d=mm';

        return (
            <Link to={ `/user/${username}` } className="profile-link">
                <span className="username">{ username }</span>
                <img src={ gravatarURI } className="profile-pic" />
            </Link>
        );
    }
});

export default ProfileLink;
