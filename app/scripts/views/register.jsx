'use strict';

var React = require('react/addons');
var Reflux = require('reflux');

// mixins
var Navigation = require('react-router').Navigation;

// actions
var userActions = require('../actions/userActions');

// stores
var userStore = require('../stores/userStore');
var errorStore = require('../stores/errorStore');

var Login = React.createClass({

    mixins: [
        Navigation,
        Reflux.listenTo(userStore, 'onUserChange'),
        Reflux.listenTo(errorStore, 'onErrorMessage')
    ],

    getInitialState: function () {
        return {
            error: ''
        };
    },

    onUserChange: function () {
        this.transitionTo('home');
    },

    onErrorMessage: function (message) {
        this.setState({
            error: message
        });
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
        var error = this.state.error ? <div className="error">{ this.state.error }</div> : '';

        return (
            <div className="login content text-center fade-in">
                <form onSubmit={ this.registerUser } className="login-form text-left">
                    <h1>Register</h1>
                    <label htmlFor="username">Username</label><br />
                    <input type="text" placeholder="Username" id="username" ref="username" /><br />
                    <label htmlFor="email">Email</label><br />
                    <input type="email" placeholder="Email" id="email" ref="email" /><br />
                    <label htmlFor="password">Password</label><br />
                    <input type="password" placeholder="Password" id="password" ref="password" /><br />
                    <button type="submit" className="button button-primary">Register</button><br />
                    { error }
                </form>
            </div>
        );
    }

});

module.exports = Login;