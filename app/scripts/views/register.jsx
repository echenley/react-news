'use strict';

var React = require('react/addons');
var Reflux = require('reflux');

var Navigation = require('react-router').Navigation;
var userActions = require('../actions/userActions');
var userStore = require('../stores/userStore');

var Login = React.createClass({

    mixins: [
        Navigation,
        Reflux.ListenerMixin
    ],

    componentDidMount: function () {
        this.listenTo(userStore, function () {
            this.transitionTo('home');
        }.bind(this));
    },

    registerUser: function (e) {
        e.preventDefault();
        var username = this.refs.username.getDOMNode().value.trim();
        var loginData = {
            email: this.refs.email.getDOMNode().value.trim(),
            password: this.refs.password.getDOMNode().value.trim()
        };
        userActions.register(username, loginData);
    },

    render: function() {

        return (
            <div className="content inner text-center">
                <h1>Register</h1>
                <form onSubmit={ this.registerUser } className="login-form text-left">
                    <label htmlFor="username">Username</label><br />
                    <input type="text" placeholder="Username" id="username" ref="username" /><br />
                    <label htmlFor="email">Email</label><br />
                    <input type="email" placeholder="Email" id="email" ref="email" /><br />
                    <label htmlFor="password">Password</label><br />
                    <input type="password" placeholder="Password" id="password" ref="password" /><br />
                    <button type="submit" className="button">Register</button>
                </form>
            </div>
        );
    }

});

module.exports = Login;