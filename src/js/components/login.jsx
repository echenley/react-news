'use strict';

var Reflux = require('reflux');

// actions
var Actions = require('../actions/Actions');

// stores
var LoginStore = require('../stores/LoginStore');
var UserStore = require('../stores/UserStore');

// components
var Spinner = require('../components/spinner');

var Login = React.createClass({

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

    componentDidMount() {
        React.findDOMNode(this.refs.email).focus();
    },

    componentWillUpdate() {
        React.findDOMNode(this.refs.email).focus();
    },

    resetForm() {
        React.findDOMNode(this.refs.email).value = '';
        React.findDOMNode(this.refs.password).value = '';
        React.findDOMNode(this.refs.submit).disabled = false;
        this.setState({
            submitted: false
        });
    },

    onErrorMessage(errorMessage) {
        React.findDOMNode(this.refs.submit).disabled = false;
        this.setState({
            error: errorMessage,
            submitted: false
        });
    },

    login(e) {
        e.preventDefault();

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
        var error = this.state.error && (
            <div className="error md-form-error">{ this.state.error }</div>
        );

        return (
            <div className="login">
                <h1>Login</h1>
                <form onSubmit={ this.login } className="md-form">
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="Email" id="email" ref="email" />
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

module.exports = Login;
