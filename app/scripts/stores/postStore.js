'use strict';

var Reflux = require('reflux');
var postActions = require('../actions/postActions');

var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/posts');

var postStore = Reflux.createStore({

    listenables: postActions,

    init: function () {
        this.posts = false;

        ref.on('value', function (posts) {
            this.posts = posts.val();
            this.trigger(this.posts);
        }.bind(this), function (error) {
            console.log("The read failed: " + error.code);
        });

    },

    upvote: function (postId, alreadyUpvoted) {
        // add or remove the upvote
        this.posts[postId].upvotes += alreadyUpvoted ? -1 : 1;
    },

    submitPost: function (post) {
        ref.push(post);
    },

    getPost: function (postId) {
        return this.posts[postId];
    },

    getDefaultData: function () {
        return this.posts;
    }
});

module.exports = postStore;















