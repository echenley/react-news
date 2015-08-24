'use strict';

import setupDOM from '../util/setup';
import createParent from '../util/createParent';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

var React;
var Login;
var TestUtils;
var findDOMNode;

chai.use(sinonChai);

describe('Login Component', () => {
    let login;

    beforeEach(() => {
        setupDOM();
        React = require('react/addons');
        Login = require('../../src/js/components/Login');
        TestUtils = React.addons.TestUtils;
        findDOMNode = React.findDOMNode;
    });

    afterEach(() => {
        // React caches required modules
        for (var i in require.cache) {
            delete require.cache[i];
        }
    });

    describe('DOM', () => {

        beforeEach(() => {
            login = TestUtils.renderIntoDocument(<Login />);
        });

        it('should render a div with className "login"', () => {
            expect(login.getDOMNode().className).to.equal('login');
        });

        it('should render an error message only when passed as prop', () => {
            let error;
            error = TestUtils.scryRenderedDOMComponentsWithClass(login, 'error');

            expect(error.length).to.equal(0);

            // rerender with errorMessage prop
            login = TestUtils.renderIntoDocument(<Login errorMessage="uh oh" />);
            error = TestUtils.findRenderedDOMComponentWithClass(login, 'error');

            expect(error.getDOMNode().textContent).to.equal('uh oh');
        });
    });

    describe('props behavior', () => {
        let parent;
        let login;

        beforeEach(() => {
            let LoginParent = createParent(Login, 'login', {
                errorMessage: '',
                user: { isLoggedIn: false }
            });

            parent = TestUtils.renderIntoDocument(<LoginParent />);
            login = parent.refs.login;
        });

        it('should disable submit button until props update', () => {
            let submitButton = findDOMNode(login.refs.submit);

            login.setState({ submitted: true });
            expect(submitButton.disabled).to.equal(true);

            parent.setState({ errorMessage: 'invalid user' });

            expect(login.state.submitted).to.equal(false);
            expect(submitButton.disabled).to.equal(false);
        });

        it('should clear form when user prop updates', () => {
            login.clearForm = sinon.spy();
            expect(login.clearForm).to.have.not.been.called;

            parent.setState({ user: { isLoggedIn: true } });
            expect(login.clearForm).to.have.been.called;
        });

    });
});