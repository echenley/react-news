'use strict';

module.exports = {
    pluralize: function(n, value) {
        if (n === 1) { return '1 ' + value; }
        return n + ' ' + value + 's';
    },
};