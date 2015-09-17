'use strict';

import setupDOM from '../util/setup';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

var React;
var LoginLinks;
var TestUtils;

chai.use(sinonChai);

describe('LoginLinks Component', () => {
    let loginLinks;

    beforeEach(() => {
        setupDOM();
        React = require('react/addons');
        LoginLinks = require('../../src/js/components/LoginLinks');
        TestUtils = React.addons.TestUtils;
    });

    afterEach(() => {
        // React caches required modules
        for (var i in require.cache) {
            delete require.cache[i];
        }
    });

    describe('DOM', function() {
        beforeEach(() => {
            loginLinks = TestUtils.renderIntoDocument(<LoginLinks />);
        });

        it('should render a span with className "login-links"', () => {
            expect(loginLinks.getDOMNode().className).to.equal('login-links');
        });

        it('should render "Sign In" and "Register" links', () => {
            let links = TestUtils.scryRenderedDOMComponentsWithTag(loginLinks, 'a');
            let linkText = links.map((link) => link.getDOMNode().textContent);

            expect(links.length).to.equal(2);
            expect(linkText[0]).to.equal('Sign In');
            expect(linkText[1]).to.equal('Register');
        });
    });
});