'use strict';

var Reflux = require('reflux');

var commentActions = {};

commentActions.getComments = Reflux.createAction();

module.exports = commentActions;