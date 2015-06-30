'use strict';

import React from 'react/addons';
import Reflux from 'reflux';

import Actions from '../actions/Actions';
import UserStore from '../stores/UserStore';

import Spinner from '../components/Spinner';

const Login = React.createClass({

    propTypes: {
        errorMessage: React.PropTypes.string
    },

    mixins: [
        Reflux.listenTo(UserStore, 'loginComplete')
    ],

    getInitialState() {
        return {
            submitted: false
        };
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps === this.props) {
            return;
        }

        React.findDOMNode(this.refs.submit).disabled = false;
        this.setState({
            submitted: false
        });
    },

    loginComplete() {
        // reset form
        React.findDOMNode(this.refs.email).value = '';
        React.findDOMNode(this.refs.password).value = '';
        React.findDOMNode(this.refs.submit).disabled = false;

        this.setState({
            submitted: false
        });
    },

    login(e) {
        e.preventDefault();

        // disable submit button
        React.findDOMNode(this.refs.submit).disabled = true;

        this.setState({
            submitted: true
        });

        Actions.login({
            email: React.findDOMNode(this.refs.email).value.trim(),
            password: React.findDOMNode(this.refs.password).value.trim()
        });
    },

    render() {
        let errorMessage = this.props.errorMessage;
        let error = errorMessage && (
            <div className="error md-form-error">{ errorMessage }</div>
        );

        return (
            <div className="login">
                <h1>Login</h1>
                <form onSubmit={ this.login } className="md-form">
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="Email" id="email" ref='email' />
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Password" id="password" ref="password" />
                    <button type="submit" className="button button-primary" ref="submit">
                        { this.state.submitted ? <Spinner /> : 'Sign In' }
                    </button>
                </form>
                { error }
            </div>
        );
    }
});

export default Login;
