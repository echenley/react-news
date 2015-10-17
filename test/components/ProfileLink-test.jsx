'use strict';

import React from 'react';
import { Link } from 'react-router';
import ProfileLink from '../../src/js/components/ProfileLink';

import TestUtils from 'react-addons-test-utils';

const userData = {
    username: 'echenley',
    md5hash: '7da6a19ef0b1a9b9794cf5c7cc7439f1'
};

const shallowRenderer = TestUtils.createRenderer();
shallowRenderer.render(<ProfileLink user={ userData } />);
const profileLink = shallowRenderer.getRenderOutput();

describe('ProfileLink Component', () => {
    describe('DOM', function() {
        it('should render a link with className "login-links"', () => {
            expect(profileLink.type).to.equal(Link);
            expect(profileLink.props.className).to.equal('profile-link');
        });

        it('should render username and gravatar', () => {
            const children = profileLink.props.children;

            expect(children.length).to.equal(2);
            expect(children[0].props.children).to.equal('echenley');
            expect(children[1].props.src).to.contain('7da6a19ef0b1a9b9794cf5c7cc7439f1');
        });
    });
});