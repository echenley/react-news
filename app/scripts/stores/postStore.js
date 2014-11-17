'use strict';

var Reflux = require('reflux');
var Firebase = require('firebase');
var postsRef = new Firebase('https://resplendent-fire-4810.firebaseio.com/posts');
var postActions = require('../actions/postActions');

var postStore = Reflux.createStore({

    listenables: postActions,

    init: function () {
        this.posts = [];
    },

    listenToAll: function (numPerPage) {
        postsRef.orderByChild('upvotes').limitToFirst(numPerPage).on('value', function (posts) {
            this.posts = [];
            posts.forEach(function (postData) {
                var post = postData.val();
                post.id = postData.key();
                this.posts.unshift(post);
            }.bind(this));
            this.trigger(this.posts);
        }.bind(this));
    },

    listenToSingle: function (postId) {
        postsRef.child(postId).on('value', function (postData) {
            var post = postData.val();
            post.id = postData.key();
            this.posts = post;
            this.trigger(this.posts);
        }.bind(this));
    },

    stopListening: function (postId) {
        if (postId) {
            postsRef.child(postId).off();
        } else {
            postsRef.off();
        }
    },

    getDefaultData: function () {
        return this.posts;
    }

});

module.exports = postStore;















