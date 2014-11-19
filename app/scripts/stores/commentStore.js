'use strict';

var Reflux = require('reflux');
var commentActions = require('../actions/commentActions');

var Firebase = require('firebase');
var commentsRef = new Firebase('https://resplendent-fire-4810.firebaseio.com/comments');

var commentStore = Reflux.createStore({

    listenables: commentActions,

    init: function () {
        this.comments = [];
    },

    _updateComments: function (comments) {
        this.comments = [];
        comments.forEach(function (commentData) {
            var comment = commentData.val();
            comment.id = commentData.key();
            this.comments.unshift(comment);
        }.bind(this));
        this.trigger(this.comments);
    },

    listenToComments: function (postId) {
        // dynamically sets callback to watch current post's comments
        // called on componentWillMount
        commentsRef.orderByChild('postId').equalTo(postId).on('value', this._updateComments.bind(this));
    },

    listenToUser: function (userId) {
        commentsRef.orderByChild('creatorUID').equalTo(userId).limitToFirst(3).on('value', this._updateComments.bind(this));
    },

    stopListening: function () {
        // removes callback for comments
        // called on componentWillUnmount
        commentsRef.off();
    },

    getDefaultData: function () {
        return this.comments;
    }
});

module.exports = commentStore;















