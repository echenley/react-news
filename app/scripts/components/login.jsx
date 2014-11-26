'use strict';

var React = require('react/addons');
var Reflux = require('reflux');

// mixins
var Navigation = require('react-router').Navigation;

// actions
var actions = require('../actions/actions');

// stores
var loginStore = require('../stores/loginStore');
var userStore = require('../stores/userStore');

// components
var Spinner = require('react-spinner');

var Login = React.createClass({

    mixins: [
        Navigation,
        Reflux.listenTo(userStore, 'resetForm'),
        Reflux.listenTo(loginStore, 'onErrorMessage')
    ],

    getInitialState: function () {
        return {
            error: '',
            submitted: false
        };
    },

    resetForm: function () {
        this.setState({
            submitted: false,
        });
        this.refs.email.getDOMNode().value = '';
        this.refs.password.getDOMNode().value = '';
        this.refs.submit.getDOMNode().disabled = false;
    },

    onErrorMessage: function (errorMessage) {
        this.refs.submit.getDOMNode().disabled = false;
        this.setState({
            error: errorMessage,
            submitted: false
        });
    },

    login: function (e) {
        e.preventDefault();

        this.refs.submit.getDOMNode().disabled = true;
        this.setState({
            submitted: true
        });

        actions.login({
            email: this.refs.email.getDOMNode().value.trim(),
            password: this.refs.password.getDOMNode().value.trim()
        });
    },

    render: function () {
        var error = this.state.error ? <div className="error login-error">{ this.state.error }</div> : '';

        return (
            <div className="login text-center md-modal" id="overlay-content">
                <form onSubmit={ this.login } className="login-form text-left">
                    <h1>Login</h1>
                    <label htmlFor="email">Email</label><br />
                    <input type="email" placeholder="Email" id="email" ref="email" /><br />
                    <label htmlFor="password">Password</label><br />
                    <input type="password" placeholder="Password" id="password" ref="password" /><br />
                    <button type="submit" className="button button-primary" ref="submit">
                        { this.state.submitted ? <Spinner /> : 'Sign In' }
                    </button>
                </form>
                { error }
            </div>
        );
    }
});

module.exports = Login;