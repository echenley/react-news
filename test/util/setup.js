'use strict';

import jsdom from 'jsdom';

function setupDOM() {
    global.document = jsdom.jsdom('<!doctype html><html><body><div id="app"></div></body></html>');
    global.window = document.defaultView;
    global.navigator = window.navigator;
}

export default setupDOM;
