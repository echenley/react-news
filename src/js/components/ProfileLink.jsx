'use strict';

import React, { PropTypes } from 'react/addons';
import Link from 'react-router/lib/Link';

const ProfileLink = React.createClass({
    propTypes: {
        user: PropTypes.object
    },

    render() {
        let { user } = this.props;

        let username = user ? user.profile.username : '';
        let md5hash = user ? user.profile.md5hash : '';
        let gravatarURI = 'http://www.gravatar.com/avatar/' + md5hash + '?d=mm';

        return (
            <span className="user-info">
                <Link to={ `/user/${username}` } className="profile-link">
                    <span className="username">{ username }</span>
                    <img src={ gravatarURI } className="profile-pic" />
                </Link>
            </span>
        );
    }
});

export default ProfileLink;
