'use strict';

var moment = require('moment');

module.exports = function timeAgo(timePosted) {
    return moment(timePosted, 'x').fromNow();
};
