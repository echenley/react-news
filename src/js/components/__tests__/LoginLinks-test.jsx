'use strict';

import React from 'react';
import { createRenderer } from 'react-addons-test-utils';

import LoginLinks from '../LoginLinks';

describe('<LoginLinks />', () => {
    describe('DOM', function() {
        it('should render correctly', () => {
            const renderer = createRenderer();
            renderer.render(<LoginLinks />);
            const actualElement = renderer.getRenderOutput();

            const expectedElement = (
                <span className="login-links">
                    <a onClick={ () => {} }>Sign In</a>
                    <a onClick={ () => {} } className="register-link">Register</a>
                </span>
            );

            expect(actualElement).to.equalJSX(expectedElement);
        });
    });
});