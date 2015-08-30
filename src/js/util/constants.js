'use strict';

const errorMessages = {
    LOGIN_REQUIRED: 'You have to login to do that.',
    INVALID_EMAIL: 'Invalid email address.',
    INVALID_PASSWORD: 'Invalid password.',
    INVALID_USER: 'User doesn\'t exist.',
    NO_COMMENT: 'You have to enter a comment.',
    NO_USERNAME: 'You have to enter a username.',
    EMAIL_TAKEN: 'That email is taken.',
    USERNAME_TAKEN: 'That username is taken.',
    generic: 'Something went wrong.'
};

const constants = {
    errorMessages: errorMessages,
    firebaseUrl: 'https://resplendent-fire-4810.firebaseio.com/'
};

export default constants;
