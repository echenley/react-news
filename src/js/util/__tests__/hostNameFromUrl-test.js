'use strict';

jest.dontMock('../hostNameFromUrl');

describe('hostNameFromUrl', function() {
    let hostNameFromUrl = require('../hostNameFromUrl');

    let urls = [
        {
            url: 'https://www.youtube.com/watch?v=_OVg8uov78I',
            hostname: 'www.youtube.com'
        },
        {
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#For_of_iteration_and_destructuring',
            hostname: 'developer.mozilla.org'
        }
    ];

    it('returns hostname correctly', function() {
        for (let { url, hostname } of urls) {
            expect(hostNameFromUrl(url)).toBe(hostname);
        }
    });
});
