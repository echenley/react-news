'use strict';

// components
var Link = require('react-router').Link;

var uhOh = React.createClass({
    render: function () {
        return (
            <div className="content full-width">
                <h1>{ 'That Page Doesn\'t Exist' }</h1>
                <p><Link to="home">Return to the homepage</Link></p>
            </div>
        );
    }
});

module.exports = uhOh;