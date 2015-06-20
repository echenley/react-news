'use strict';

module.exports = function pluralize(n, value) {
    if (n === 1) { return '1 ' + value; }
    return n + ' ' + value + 's';
};
