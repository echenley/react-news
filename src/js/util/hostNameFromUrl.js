'use strict';

export default function hostnameFromUrl(str: string): string {
    let url = document.createElement('a');
    url.href = /^(f|ht)tps?:\/\//i.test(url) ? 'http://' + str : str;
    return url.hostname;
}
