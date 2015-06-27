'use strict';

import moment from 'moment';

export default function timeAgo(timePosted) {
    return moment(timePosted, 'x').fromNow();
}
