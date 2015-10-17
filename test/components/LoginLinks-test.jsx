'use strict';

import { findDOMNode } from 'react-dom';

var React;
var LoginLinks;
var TestUtils;

describe('LoginLinks Component', () => {
    let loginLinks;

    beforeEach(() => {
        React = require('react');
        LoginLinks = require('../../src/js/components/LoginLinks');
        TestUtils = require('react-addons-test-utils');
    });

    describe('DOM', function() {
        beforeEach(() => {
            loginLinks = TestUtils.renderIntoDocument(<LoginLinks />);
        });

        it('should render a span with className "login-links"', () => {
            expect(findDOMNode(loginLinks).className).to.equal('login-links');
        });

        it('should render "Sign In" and "Register" links', () => {
            let links = TestUtils.scryRenderedDOMComponentsWithTag(loginLinks, 'a');
            let linkText = links.map((link) => findDOMNode(link).textContent);

            expect(links.length).to.equal(2);
            expect(linkText[0]).to.equal('Sign In');
            expect(linkText[1]).to.equal('Register');
        });
    });
});