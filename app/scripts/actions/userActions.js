'use strict';

var Reflux = require('reflux');

var userActions = {};

userActions.signIn = Reflux.createAction();
userActions.signOut = Reflux.createAction();

module.exports = userActions;