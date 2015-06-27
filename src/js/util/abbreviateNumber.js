/* @flow */

'use strict';

let suffixes = ['k', 'm', 'b'];

export default function abbreviateNumber(num: string, precision: number): string {
    // precision 2 => 100
    precision = Math.pow(10, precision);

    for (let i = suffixes.length - 1; i >= 0; i--) {
        // 1e9, 1e6, 1e3
        let magnitude = Math.pow(10, (i + 1) * 3);

        if (magnitude > num) {
            continue;
        }

        // 1100 => 1.1
        num = Math.round(num * precision / magnitude) / precision;

        // add suffix
        num += suffixes[i];

        break;
    }

    return '' + num;
}
