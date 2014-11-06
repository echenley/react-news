'use strict';

var React = require('react/addons');

var Reflux = require('reflux');

var Navigation = require('react-router').Navigation;
var userActions = require('../actions/userActions');
var userStore = require('../stores/userStore');

var Profile = React.createClass({

	mixins: [Navigation, Reflux.connect(userStore, 'user')],

	getInitialState: function () {
		return {
			user: {}
		};
	},

	logout: function (e) {
		e.preventDefault();
        userActions.signOut();
	    this.transitionTo('home');
	},

	render: function() {
		return (
			<div className="content inner">
				<a onClick={ this.logout }>Logout</a>
			</div>
		);
	}

});

module.exports = Profile;