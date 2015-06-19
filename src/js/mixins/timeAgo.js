'use strict';

var moment = require('moment');

module.exports = {
    timeAgo: function(timePosted) {
        return moment(timePosted, 'x').fromNow();
    },
};