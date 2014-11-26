'use strict';

var React = require('react/addons');
var Reflux = require('reflux');

// mixins
var Navigation = require('react-router').Navigation;

// actions
var actions = require('../actions/actions');

// stores
var userStore = require('../stores/userStore');
var loginStore = require('../stores/loginStore');

// components
var Spinner = require('react-spinner');

var Login = React.createClass({

    mixins: [
        Navigation,
        Reflux.listenTo(userStore, 'onUserChange'),
        Reflux.listenTo(loginStore, 'onErrorMessage')
    ],

    getInitialState: function () {
        return {
            error: '',
            submitted: false
        };
    },

    onErrorMessage: function (errorMessage) {
        this.refs.submit.getDOMNode().disabled = false;
        this.setState({
            error: errorMessage,
            submitted: false
        });
    },

    onUserChange: function () {
        this.transitionTo('home');
    },

    registerUser: function (e) {
        e.preventDefault();

        this.refs.submit.getDOMNode().disabled = true;
        this.setState({
            submitted: true
        });

        var loginData = {
            email: this.refs.email.getDOMNode().value.trim(),
            password: this.refs.password.getDOMNode().value.trim()
        };
        var username = this.refs.username.getDOMNode().value.trim();
        actions.register(username, loginData);
    },

    render: function () {
        var error = this.state.error ? <div className="error login-error">{ this.state.error }</div> : '';

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
                    <button type="submit" className="button button-primary" ref="submit">
                        { this.state.submitted ? <Spinner /> : 'Register' }
                    </button>
                </form>
                { error }
            </div>
        );
    }

});

module.exports = Login;