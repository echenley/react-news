'use strict';

var React;
var LoginLinks;
var TestUtils;

describe('LoginLinks Component', () => {
    let loginLinks;

    beforeEach(() => {
        React = require('react/addons');
        LoginLinks = require('../../src/js/components/LoginLinks');
        TestUtils = React.addons.TestUtils;
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