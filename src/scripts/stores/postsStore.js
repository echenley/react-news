'use strict';

var Reflux = require('reflux');
var Firebase = require('firebase');
var postsRef = new Firebase('https://resplendent-fire-4810.firebaseio.com/posts');
var actions = require('../actions/actions');

var postStore = Reflux.createStore({

    listenables: actions,

    init: function () {
        this.postsData = {
            posts: [],
            sortOptions: {
                currentIndex: 0,
                values: ['upvotes', 'newest', 'comments']
            }
        };
        this.sortBy = ['upvotes', 'time', 'commentCount'];
    },

    setSortBy: function (index) {
        this.postsData.sortOptions.currentIndex = index;
        this.stopListeningToPosts();
        this.listenToPosts(this.sortBy[index]);
    },

    listenToPosts: function (sortBy) {
        postsRef.orderByChild(sortBy).limitToLast(20).on('value', this.updatePosts.bind(this));
    },

    stopListeningToPosts: function () {
        postsRef.off();
    },

    updatePosts: function (posts) {
        this.postsData.posts = [];
        posts.forEach(function (postData) {
            var post = postData.val();
            post.id = postData.key();
            this.postsData.posts.unshift(post);
        }.bind(this));
        this.trigger(this.postsData);
    },

    getDefaultData: function () {
        return this.postsData;
    }

});

module.exports = postStore;















