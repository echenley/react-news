'use strict';

var Reflux = require('reflux');
var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
var postsRef = ref.child('posts');
var commentsRef = ref.child('comments');
var actions = require('../actions/actions');

// store listener references
var postListener, commentListener;

var profileStore = Reflux.createStore({

    listenables: actions,

    init: function () {
        this.profileData = {
            posts: [],
            comments: []
        };
    },

    listenToProfile: function (userId) {
        postListener = postsRef.orderByChild('creatorUID').equalTo(userId).limitToFirst(3).on('value', this.updatePosts.bind(this));
        commentListener = commentsRef.orderByChild('creatorUID').equalTo(userId).limitToFirst(3).on('value', this.updateComments.bind(this));
    },

    stopListeningToProfile: function () {
        postsRef.off('value', postListener);
        commentsRef.off('value', commentListener);
    },

    updatePosts: function (posts) {
        this.profileData.posts = [];
        posts.forEach(function (postData) {
            var post = postData.val();
            post.id = postData.key();
            this.profileData.posts.unshift(post);
        }.bind(this));
        this.trigger(this.profileData);
    },

    updateComments: function (comments) {
        this.profileData.comments = [];
        comments.forEach(function (commentData) {
            var comment = commentData.val();
            comment.id = commentData.key();
            this.profileData.comments.unshift(comment);
        }.bind(this));
        this.trigger(this.profileData);
    },

    getDefaultData: function () {
        return this.profileData;
    }
});

module.exports = profileStore;