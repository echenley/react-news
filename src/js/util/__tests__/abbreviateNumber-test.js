'use strict';

import abbreviateNumber from '../abbreviateNumber';

describe('abbreviateNumber', () => {
    it('always returns a string', () => {
        expect(abbreviateNumber(1, 0)).to.equal('1');
        expect(abbreviateNumber(999, 1)).to.equal('999');
    });

    it('abbreviates numbers correctly', () => {
        expect(abbreviateNumber(0, 2)).to.equal('0');
        expect(abbreviateNumber(12, 1)).to.equal('12');
        expect(abbreviateNumber(1000, 1)).to.equal('1k');
        expect(abbreviateNumber(1234, 0)).to.equal('1k');
        expect(abbreviateNumber(34567, 2)).to.equal('34.57k');
        expect(abbreviateNumber(918395, 1)).to.equal('918.4k');
        expect(abbreviateNumber(2134124, 2)).to.equal('2.13m');
        expect(abbreviateNumber(47475782130, 2)).to.equal('47.48b');
    });
});
