'use strict';

import pluralize from '../pluralize';

describe('pluralize', function() {
    it('pluralizes correctly', function() {
        expect(pluralize(1, 'comment')).to.equal('1 comment');
        expect(pluralize(21, 'comment')).to.equal('21 comments');
        expect(pluralize(10, 'turkey')).to.equal('10 turkeys');
    });
});
