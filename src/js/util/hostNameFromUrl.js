'use strict';

module.exports = function hostnameFromUrl(str) {
    var url = document.createElement('a');
    url.href = /^(f|ht)tps?:\/\//i.test(url) ? 'http://' + str : str;
    return url.hostname;
};
