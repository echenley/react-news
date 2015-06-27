'use strict';

export default function pluralize(n: number, value: string): string {
    if (n === 1) { return '1 ' + value; }
    return n + ' ' + value + 's';
}
