'use strict';

import React from 'react';
import { findDOMNode } from 'react-dom';
import createParent from '../../../../test/util/createParent';
import Register from '../Register';

import {
    createRenderer,
    renderIntoDocument,
    findRenderedDOMComponentWithTag
} from 'react-addons-test-utils';

const userData = {
    username: 'echenley',
    md5hash: '7da6a19ef0b1a9b9794cf5c7cc7439f1'
};

const errorMessage = 'uh oh';

const renderer = createRenderer();

describe('<Register />', () => {
    describe('DOM', () => {
        it('should render correctly WITH errorMessage prop', () => {
            // login with errorMessage prop
            renderer.render(<Register user={ userData } errorMessage={ errorMessage } />);
            const actualElement = renderer.getRenderOutput();

            const expectedErrorMessage = (
                <div className="error modal-form-error">{ errorMessage }</div>
            );

            expect(actualElement).to.includeJSX(expectedErrorMessage);
        });

        it('should render correctly WITHOUT errorMessage prop', () => {
            // login without errorMessage prop
            renderer.render(<Register user={ userData } />);
            const actualElement = renderer.getRenderOutput();
            const actualErrorMessage = actualElement.props.children[2];

            expect(actualErrorMessage).to.not.exist;
        });
    });

    describe('Behavior', () => {
        let parent;
        let register;

        beforeEach(() => {
            let LoginParent = createParent(Register, 'register', {
                errorMessage: '',
                user: { isLoggedIn: false }
            });

            parent = renderIntoDocument(<LoginParent />);
            register = parent.refs.register;
        });

        it('should disable submit button until props update', () => {
            let submitButton = findDOMNode(findRenderedDOMComponentWithTag(register, 'button'));

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