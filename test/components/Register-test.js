'use strict';

import setupDOM from '../util/setup';
import createParent from '../util/createParent';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

var React;
var Register;
var TestUtils;

chai.use(sinonChai);

describe('Register Component', () => {
    let register;

    beforeEach(() => {
        setupDOM();
        React = require('react/addons');
        Register = require('../../src/js/components/Register');
        TestUtils = React.addons.TestUtils;
    });

    afterEach(() => {
        // React caches required modules
        for (var i in require.cache) {
            delete require.cache[i];
        }
    });

    describe('DOM', () => {

        beforeEach(() => {
            register = TestUtils.renderIntoDocument(<Register />);
        });

        it('should render a div with className "register"', () => {
            expect(register.getDOMNode().className).to.equal('register');
        });

        it('should render an error message only when passed as prop', () => {
            let error;
            error = TestUtils.scryRenderedDOMComponentsWithClass(register, 'error');

            expect(error.length).to.equal(0);

            // rerender with errorMessage prop
            register = TestUtils.renderIntoDocument(<Register errorMessage="uh oh" />);
            error = TestUtils.findRenderedDOMComponentWithClass(register, 'error');

            expect(error.getDOMNode().textContent).to.equal('uh oh');
        });
    });

    describe('props behavior', () => {
        let parent;
        let register;

        beforeEach(() => {
            let RegisterParent = createParent(Register, 'register', {
                errorMessage: '',
                user: { isLoggedIn: false }
            });

            parent = TestUtils.renderIntoDocument(<RegisterParent />);
            register = parent.refs.register;
        });

        it('should disable submit button until props update', () => {
            let submitButton = TestUtils.findRenderedDOMComponentWithTag(register, 'button').getDOMNode();

            register.setState({ submitted: true });
            expect(submitButton.disabled).to.equal(true);

            parent.setState({ errorMessage: 'invalid user' });

            expect(register.state.submitted).to.equal(false);
            expect(submitButton.disabled).to.equal(false);
        });

        it('should clear form when user prop updates', () => {
            register.clearForm = sinon.spy();
            expect(register.clearForm).to.have.not.been.called;

            parent.setState({ user: { isLoggedIn: true } });
            expect(register.clearForm).to.have.been.called;
        });

    });
});