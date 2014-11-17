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

    login: function (e) {
        e.preventDefault();

        userActions.login({
            email: this.refs.email.getDOMNode().value.trim(),
            password: this.refs.password.getDOMNode().value.trim()
        });
    },

    render: function() {

        return (
            <div className="content inner text-center">
                <h1>Login</h1>
                <form onSubmit={ this.login } className="login-form text-left">
                    <label htmlFor="email">Email</label><br />
                    <input type="email" placeholder="Email" id="email" ref="email" /><br />
                    <label htmlFor="password">Password</label><br />
                    <input type="password" placeholder="Password" id="password" ref="password" /><br />
                    <button type="submit" className="button">Sign In</button>
                </form>
            </div>
        );
    }

});

module.exports = Login;