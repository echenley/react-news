'use strict';

import Reflux from 'reflux';
import Actions from '../actions/Actions';
import { errorMessages } from '../util/constants';

function getErrorMessage(code) {
    return errorMessages[code] || errorMessages.generic;
}

let modalState = {
    type: false,
    errorMessage: ''
};

const ModalStore = Reflux.createStore({

    listenables: Actions,

    showModal(type, errorCode) {
        modalState = {
            type: type,
            errorMessage: errorCode ? getErrorMessage(errorCode) : ''
        };

        this.trigger(modalState);
    },

    hideModal() {
        modalState.type = false;
        this.trigger(modalState);
    },

    modalError(errorCode) {
        modalState.errorMessage = getErrorMessage(errorCode);
        this.trigger(modalState);
    },

    getDefaultData() {
        return modalState;
    }

});

export default ModalStore;
