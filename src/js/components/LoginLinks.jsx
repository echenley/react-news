'use strict';

import React from 'react';
import Actions from '../actions/Actions';

const LoginLinks = React.createClass({
    render() {
        return (
            <span className="login-links">
                <a onClick={ () => Actions.showModal('login') }>Sign In</a>
                <a onClick={ () => Actions.showModal('register') } className="register-link">Register</a>
            </span>
        );
    }
});

export default LoginLinks;
