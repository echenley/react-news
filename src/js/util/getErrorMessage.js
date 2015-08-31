'use strict';

import { errorMessages } from './constants';

function getErrorMessage(code) {
    return errorMessages[code] || errorMessages.generic;
}

export default getErrorMessage;
