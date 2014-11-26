'use strict';

var Reflux = require('reflux');
var Firebase = require('firebase');
var postsRef = new Firebase('https://resplendent-fire-4810.firebaseio.com/posts');
var actions = require('../actions/actions');

var postStore = Reflux.createStore({

    listenables: actions,

    init: function () {
        this.posts = [];
    },

    listenToPosts: function (sortBy) {
        postsRef.orderByChild(sortBy).limitToLast(20).on('value', this.updatePosts.bind(this));
    },

    stopListeningToPosts: function () {
        postsRef.off();
    },

    updatePosts: function (posts) {
        this.posts = [];
        posts.forEach(function (postData) {
            var post = postData.val();
            post.id = postData.key();
            this.posts.unshift(post);
        }.bind(this));
        this.trigger(this.posts);
    },

    getDefaultData: function () {
        return this.posts;
    }

});

module.exports = postStore;















