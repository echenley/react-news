'use strict';

var React = require('react/addons');
// var userActions = require('../actions/userActions');

var Register = React.createClass({

	registerUser: function (e) {
		e.preventDefault();
		console.log(this.refs.password.getDOMNode().value.trim());
	},

	render: function() {

		return (
			<div className="content inner">
				<form onSubmit={ this.registerUser }>
                    <label for="username">Username</label>
                    <input type="text" placeholder="Username" id="username" ref="username" />
                    <label for="password">Password</label>
                    <input type="password" placeholder="Password" id="password" ref="password" />
                    <input type="submit" />
				</form>
			</div>
		);
	}

});

module.exports = Register;