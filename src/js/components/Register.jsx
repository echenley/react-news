'use strict';

import React from 'react/addons';
import Reflux from 'reflux';

import Actions from '../actions/Actions';

import LoginStore from '../stores/LoginStore';
import UserStore from '../stores/UserStore';

import Spinner from '../components/Spinner';

const Register = React.createClass({

    mixins: [
        Reflux.listenTo(UserStore, 'resetForm'),
        Reflux.listenTo(LoginStore, 'onErrorMessage')
    ],

    getInitialState() {
        return {
            error: '',
            submitted: false
        };
    },

    resetForm() {
        this.setState({
            submitted: false
        });
        React.findDOMNode(this.refs.username).value = '';
        React.findDOMNode(this.refs.email).value = '';
        React.findDOMNode(this.refs.password).value = '';
        React.findDOMNode(this.refs.submit).disabled = false;
    },

    onErrorMessage(errorMessage) {
        React.findDOMNode(this.refs.submit).disabled = false;
        this.setState({
            error: errorMessage,
            submitted: false
        });
    },

    registerUser(e) {
        e.preventDefault();

        React.findDOMNode(this.refs.submit).disabled = true;
        this.setState({
            submitted: true
        });

        let loginData = {
            email: React.findDOMNode(this.refs.email).value.trim(),
            password: React.findDOMNode(this.refs.password).value.trim()
        };

        let username = React.findDOMNode(this.refs.username).value.trim();

        Actions.register(username, loginData);
    },

    render() {
        let error = this.state.error && (
            <div className="error md-form-error">{ this.state.error }</div>
        );

        return (
            <div className="register">
                <h1>Register</h1>
                <form onSubmit={ this.registerUser } className="md-form">
                    <label htmlFor="username">Username</label>
                    <input type="text" placeholder="Username" id="username" ref="username" />
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="Email" id="email" ref="email" />
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Password" id="password" ref="password" />
                    <button type="submit" className="button button-primary" ref="submit">
                        { this.state.submitted ? <Spinner /> : 'Register' }
                    </button>
                </form>
                { error }
            </div>
        );
    }

});

export default Register;
