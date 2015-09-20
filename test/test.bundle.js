'use strict';

var context = require.context('./components/', true, /-test\.(js|jsx)$/);
context.keys().forEach(context);
