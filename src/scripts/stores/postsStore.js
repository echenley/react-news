'use strict';

var Reflux = require('reflux');
var Firebase = require('firebase');
var postsRef = new Firebase('https://resplendent-fire-4810.firebaseio.com/posts');
var actions = require('../actions/actions');

var postsPerPage = 6;

var postStore = Reflux.createStore({

    listenables: actions,

    init: function () {
        this.posts = [];
        this.postsData = {
            posts: [],
            currentPage: 1,
            sortOptions: {
                currentValue: 'upvotes',
                values: {
                    // values mapped to firebase locations
                    'upvotes': 'upvotes',
                    'newest': 'time',
                    'comments': 'commentCount'
                },
            }
        };
    },

    setSortBy: function (value) {
        var sortOptions = this.postsData.sortOptions;
        this.postsData.currentPage = 1;
        sortOptions.currentValue = value;
        this.listenToPosts();
    },

    setPostsPage: function (pageNum) {
        this.postsData.currentPage = pageNum;
        this.listenToPosts();
    },

    listenToPosts: function () {
        var sortOptions = this.postsData.sortOptions;
        this.stopListeningToPosts();
        postsRef
            .orderByChild(sortOptions.values[sortOptions.currentValue])
            .limitToLast(this.postsData.currentPage * postsPerPage)
            .on('value', this.updatePosts.bind(this));
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
        this.triggerUpdate();
    },

    triggerUpdate: function () {
        var startAt = (this.postsData.currentPage - 1) * postsPerPage;
        var endAt = startAt + postsPerPage;
        this.postsData.posts = this.posts.slice(startAt, endAt);
        this.trigger(this.postsData);
    },

    getDefaultData: function () {
        return this.postsData;
    }

});

module.exports = postStore;















