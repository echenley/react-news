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

    login: function (e) {
        e.preventDefault();

        userActions.login({
            email: this.refs.email.getDOMNode().value.trim(),
            password: this.refs.password.getDOMNode().value.trim()
        });
    },

    render: function() {
        var error = this.state.error ? <div className="error">{ this.state.error }</div> : '';

        return (
            <div className="login content text-center fade-in">
                <form onSubmit={ this.login } className="login-form text-left">
                    <h1>Login</h1>
                    <label htmlFor="email">Email</label><br />
                    <input type="email" placeholder="Email" id="email" ref="email" /><br />
                    <label htmlFor="password">Password</label><br />
                    <input type="password" placeholder="Password" id="password" ref="password" /><br />
                    <button type="submit" className="button button-primary">Sign In</button><br />
                    { error }
                </form>
            </div>
        );
    }

});

module.exports = Login;