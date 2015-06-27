'use strict';

jest.dontMock('../abbreviateNumber');

describe('abbreviateNumber', function() {
    let abbreviateNumber = require('../abbreviateNumber');

    it('always returns a string', function() {
        expect(abbreviateNumber(1, 0)).toBe('1');
        expect(abbreviateNumber(999, 1)).toBe('999');
    });

    it('abbreviates numbers correctly', function() {
        expect(abbreviateNumber(0, 2), '0');
        expect(abbreviateNumber(12, 1), '12');
        expect(abbreviateNumber(1000, 1)).toBe('1k');
        expect(abbreviateNumber(1234, 0), '1k');
        expect(abbreviateNumber(34567, 2), '34.57k');
        expect(abbreviateNumber(918395, 1), '918.4k');
        expect(abbreviateNumber(2134124, 2), '2.13m');
        expect(abbreviateNumber(47475782130, 2), '47.48b');
        expect(abbreviateNumber(47475782130000, 2), '47.48t');
    });
});
