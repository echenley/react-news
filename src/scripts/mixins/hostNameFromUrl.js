'use strict';

module.exports = {
    hostnameFromUrl: function(str) {
        var url = document.createElement('a');
        url.href = /^(f|ht)tps?:\/\//i.test(url) ? 'http://' + str : str;
        return url.hostname;
    }
};