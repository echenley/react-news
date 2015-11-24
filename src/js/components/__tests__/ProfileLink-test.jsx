'use strict';

import React from 'react';
import { createRenderer } from 'react-addons-test-utils';

import { Link } from 'react-router';
import ProfileLink from '../ProfileLink';

const userData = {
    username: 'echenley',
    md5hash: '7da6a19ef0b1a9b9794cf5c7cc7439f1'
};

const renderer = createRenderer();
renderer.render(<ProfileLink user={ userData } />);
const actualElement = renderer.getRenderOutput();

const expectedElement = (
    <Link to={ `/user/${userData.username}` } className="profile-link">
        <span className="username">{ userData.username }</span>
        <img src={ `http://www.gravatar.com/avatar/${userData.md5hash}?d=mm` } className="profile-pic" />
    </Link>
);

describe('<ProfileLink />', () => {
    describe('DOM', function() {
        it('should render correctly', () => {
            expect(actualElement).to.equalJSX(expectedElement);
        });
    });
});