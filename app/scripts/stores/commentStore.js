'use strict';

var Reflux = require('reflux');
var commentActions = require('../actions/commentActions');

var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/comments');

var commentStore = Reflux.createStore({

    listenables: commentActions,

    init: function () {
        this.comments = {};
    },

    getComments: function (postId) {
        ref.child(postId).once('value', function (comments) {
            this.comments[postId] = comments.val() || {};
            this.trigger(this.comments[postId]);
        }.bind(this));
    },

    getDefaultData: function () {
        return this.comments;
    }
});

module.exports = commentStore;















