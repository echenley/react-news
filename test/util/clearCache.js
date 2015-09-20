'use strict';

export default () => {
    // React caches required modules
    for (var i in require.cache) {
        delete require.cache[i];
    }
};
