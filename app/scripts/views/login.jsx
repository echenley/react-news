'use strict';

var React = require('react/addons');

var Navigation = require('react-router').Navigation;
var userActions = require('../actions/userActions');

var Login = React.createClass({

	mixins: [Navigation],

	signIn: function (e) {
		e.preventDefault();

        userActions.signIn({
            email: this.refs.email.getDOMNode().value.trim(),
            password: this.refs.password.getDOMNode().value.trim()
        });
        
		this.transitionTo('home');
	},

	render: function() {

		return (
			<div className="content inner">
				<form onSubmit={ this.signIn }>
                    <label htmlFor="email">Email</label>
                    <input type="text" placeholder="Username" id="email" ref="email" />
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Password" id="password" ref="password" />
                    <input type="submit" />
				</form>
			</div>
		);
	}

});

module.exports = Login;