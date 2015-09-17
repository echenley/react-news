'use strict';

import setupDOM from '../util/setup';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

var React;
var ProfileLink;
var TestUtils;

chai.use(sinonChai);

const userData = {
    username: 'echenley',
    md5hash: '7da6a19ef0b1a9b9794cf5c7cc7439f1'
};

describe('ProfileLink Component', () => {
    let profileLink;

    beforeEach(() => {
        setupDOM();
        React = require('react/addons');
        ProfileLink = require('../../src/js/components/ProfileLink');
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
            profileLink = TestUtils.renderIntoDocument(<ProfileLink user={ userData } />);
        });

        it('should render a link with className "login-links"', () => {
            expect(profileLink.getDOMNode().className).to.equal('profile-link');
        });

        it('should render username and gravatar', () => {
            let childNodes = profileLink.getDOMNode().childNodes;

            expect(childNodes.length).to.equal(2);
            expect(childNodes[0].textContent).to.equal('echenley');
            expect(childNodes[1].src).to.contain('7da6a19ef0b1a9b9794cf5c7cc7439f1');
        });
    });
});