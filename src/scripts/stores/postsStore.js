'use strict';

var Reflux = require('reflux');
var Firebase = require('firebase');
var postsRef = new Firebase('https://resplendent-fire-4810.firebaseio.com/posts');
var actions = require('../actions/actions');

var postsPerPage = 6;

var postsStore = Reflux.createStore({

    listenables: actions,

    init: function () {
        this.posts = [];
        this.currentPage = 1;
        this.nextPage = true;
        this.sortOptions = {
            currentValue: 'upvotes',
            values: {
                // values mapped to firebase locations
                'upvotes': 'upvotes',
                'newest': 'time',
                'comments': 'commentCount'
            },
        };
    },

    setSortBy: function (value) {
        this.sortOptions.currentValue = value;
    },

    listenToPosts: function (pageNum) {
        this.currentPage = pageNum;
        postsRef
            .orderByChild(this.sortOptions.values[this.sortOptions.currentValue])
            // + 1 extra post to determine whether another page exists
            .limitToLast((this.currentPage * postsPerPage) + 1)
            .on('value', this.updatePosts.bind(this));
    },

    stopListeningToPosts: function () {
        postsRef.off();
    },

    updatePosts: function (posts) {
        // posts is all posts through current page + 1
        var endAt = this.currentPage * postsPerPage;
        var startAt = endAt - postsPerPage;

        var allPosts = [];
        posts.forEach(function (postData) {
            var post = postData.val();
            post.id = postData.key();
            allPosts.unshift(post);
        }.bind(this));

        // if extra post doesn't exist, indicate that there are no more posts
        this.nextPage = (allPosts.length === endAt + 1);        
        // slice off the last page worth
        this.posts = allPosts.slice(startAt, endAt);

        this.trigger({
            posts: this.posts,
            currentPage: this.currentPage,
            nextPage: this.nextPage,
            sortOptions: this.sortOptions
        });
    },

    getDefaultData: function () {
        return {
            posts: this.posts,
            currentPage: this.currentPage,
            nextPage: this.nextPage,
            sortOptions: this.sortOptions
        };
    }

});

module.exports = postsStore;















