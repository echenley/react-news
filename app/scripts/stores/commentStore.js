'use strict';

var Reflux = require('reflux');
var commentActions = require('../actions/commentActions');

var Firebase = require('firebase');
var commentsRef = new Firebase('https://resplendent-fire-4810.firebaseio.com/comments');

var commentStore = Reflux.createStore({

    listenables: commentActions,

    init: function () {
        this.comments = {};
    },

    setFirebaseCallback: function (postId) {
        // dynamically sets callback to watch current post's comments
        // called on componentWillMount
        commentsRef.child(postId).on('value', function (comments) {
            this.comments[postId] = comments.val();
            this.trigger(this.comments[postId]);
        }.bind(this));
    },

    removeFirebaseCallback: function (postId) {
        // removes callback for current post's comments
        // called on componentWillUnmount
        commentsRef.child(postId).off('value');
    },

    getDefaultData: function () {
        return this.comments;
    }
});

module.exports = commentStore;















