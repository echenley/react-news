'use strict';

import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

const ProfileLink = (props) => {
    const { username, md5hash } = props.user;
    const gravatarURI = 'http://www.gravatar.com/avatar/' + md5hash + '?d=mm';

    return (
        <Link to={ `/user/${username}` } className="profile-link">
            <span className="username">{ username }</span>
            <img src={ gravatarURI } className="profile-pic" />
        </Link>
    );
};

ProfileLink.propTypes = {
    user: PropTypes.object
};

export default ProfileLink;
