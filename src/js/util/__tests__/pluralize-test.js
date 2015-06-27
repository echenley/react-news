'use strict';

jest.dontMock('../pluralize');

describe('hostNameFromUrl', function() {
    let pluralize = require('../pluralize');

    it('pluralize correctly', function() {
        expect(pluralize(1, 'comment')).toBe('1 comment');
        expect(pluralize(21, 'comment')).toBe('21 comments');
        expect(pluralize(10, 'turkey')).toBe('10 turkeys');
    });
});
