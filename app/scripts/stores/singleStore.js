'use strict';

var Reflux = require('reflux');
var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
var postsRef = ref.child('posts');
var commentsRef = ref.child('comments');
var actions = require('../actions/actions');

// store listener references
var postListener, commentListener;

var postStore = Reflux.createStore({

    listenables: actions,

    init: function () {
        this.postData = {
            post: {},
            comments: []
        };
    },

    listenToPost: function (postId) {
        postListener = postsRef.child(postId).on('value', this.updatePost.bind(this));
        commentListener = commentsRef.orderByChild('postId').equalTo(postId).on('value', this.updateComments.bind(this));
    },

    updatePost: function (postData) {
        var post = postData.val();
        post.id = postData.key();
        this.postData.post = post;
        this.trigger(this.postData);
    },

    updateComments: function (comments) {
        this.postData.comments = [];
        comments.forEach(function (commentData) {
            var comment = commentData.val();
            comment.id = commentData.key();
            this.postData.comments.unshift(comment);
        }.bind(this));
        this.trigger(this.postData);
    },

    stopListening: function (postId) {
        postsRef.child(postId).off('value', postListener);
        commentsRef.off('value', commentListener);
    },

    getDefaultData: function () {
        return this.postData;
    }

});

module.exports = postStore;















