'use strict';

import React from 'react/addons';
import Actions from '../actions/Actions';

const LoginLinks = React.createClass({
    render() {
        return (
            <span>
                <a onClick={ () => Actions.showModal('login') }>Sign In</a>
                <a onClick={ () => Actions.showModal('register') } className="register-link">Register</a>
            </span>
        );
    }
});

export default LoginLinks;
