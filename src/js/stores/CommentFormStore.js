'use strict';

import Reflux from 'reflux';
import Actions from '../actions/Actions';
import getErrorMessage from '../util/getErrorMessage';

let commentFormData = {
    errorMessage: ''
};

const CommentFormStore = Reflux.createStore({

    listenables: Actions,

    commentFormError(errorCode) {
        commentFormData.errorMessage = getErrorMessage(errorCode);
        this.trigger(commentFormData);
    },

    clearCommentFormError() {
        commentFormData.errorMessage = '';
        this.trigger(commentFormData);
    },

    getDefaultData() {
        return commentFormData;
    }

});

export default CommentFormStore;
