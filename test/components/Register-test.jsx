'use strict';

import createParent from '../util/createParent';

var React;
var Register;
var TestUtils;

describe('Register Component', () => {

    beforeEach(() => {
        React = require('react/addons');
        Register = require('../../src/js/components/Register');
        TestUtils = React.addons.TestUtils;
    });

    describe('DOM', () => {
        let register;
        let error;

        beforeEach(() => {
            register = TestUtils.renderIntoDocument(<Register />);
        });

        it('should render a div with className "register"', () => {
            expect(register.getDOMNode().className).to.equal('register');
        });

        it('should not render an error message when not passed one', () => {
            error = TestUtils.scryRenderedDOMComponentsWithClass(register, 'error');
            expect(error.length).to.equal(0);
        });

        it('should render an error message when passed as prop', () => {
            register = TestUtils.renderIntoDocument(<Register errorMessage="uh oh" />);
            error = TestUtils.findRenderedDOMComponentWithClass(register, 'error');
            expect(error.getDOMNode().textContent).to.equal('uh oh');
        });
    });

    describe('Props', () => {
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