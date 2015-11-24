'use strict';

export default function hostnameFromUrl(str: string): string {
    let url = document.createElement('a');
    url.href = /^(f|ht)tps?:\/\//i.test(str) ? str : 'http://' + str;
    return url.hostname;
}
