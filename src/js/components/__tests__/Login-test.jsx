'use strict';

import React from 'react';
import { findDOMNode } from 'react-dom';
import createParent from '../../../../test/util/createParent';
import Login from '../Login';

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

describe('<Login />', () => {
    describe('DOM', () => {
        it('should render correctly WITH errorMessage prop', () => {
            // login with errorMessage prop
            renderer.render(<Login user={ userData } errorMessage={ errorMessage } />);
            const actualElement = renderer.getRenderOutput();

            const expectedErrorMessage = (
                <div className="error modal-form-error">{ errorMessage }</div>
            );

            expect(actualElement).to.includeJSX(expectedErrorMessage);
        });

        it('should render correctly WITHOUT errorMessage prop', () => {
            // login without errorMessage prop
            renderer.render(<Login user={ userData } />);
            const actualElement = renderer.getRenderOutput();
            const actualErrorMessage = actualElement.props.children[2];

            expect(actualErrorMessage).to.not.exist;
        });
    });

    describe('Behavior', () => {
        let parent;
        let login;

        beforeEach(() => {
            let LoginParent = createParent(Login, 'login', {
                errorMessage: '',
                user: { isLoggedIn: false }
            });

            parent = renderIntoDocument(<LoginParent />);
            login = parent.refs.login;
        });

        it('should disable submit button until props update', () => {
            let submitButton = findDOMNode(findRenderedDOMComponentWithTag(login, 'button'));

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