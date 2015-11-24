'use strict';

import equalJSX from 'chai-equal-jsx';

chai.use(equalJSX);

var context = require.context('../src/js/', true, /-test\.(js|jsx)$/);
context.keys().forEach(context);
