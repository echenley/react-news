'use strict';

import React from 'react';

// components
const Link = require('react-router').Link;

const uhOh = React.createClass({
    render() {
        return (
            <div className="content full-width">
                <h1>{ 'That Page Doesn\'t Exist' }</h1>
                <p><Link to="/">Return to the homepage</Link></p>
            </div>
        );
    }
});

export default uhOh;
