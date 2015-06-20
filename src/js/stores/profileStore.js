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

    init() {
        this.userId = '';
        this.posts = [];
        this.comments = [];
    },

    listenToProfile(userId) {
        this.userId = userId;

        postListener = postsRef
            .orderByChild('creatorUID')
            .equalTo(userId)
            .limitToLast(3)
            .on('value', this.updatePosts.bind(this));

        commentListener = commentsRef
            .orderByChild('creatorUID')
            .equalTo(userId)
            .limitToLast(3)
            .on('value', this.updateComments.bind(this));
    },

    stopListeningToProfile() {
        postsRef.off('value', postListener);
        commentsRef.off('value', commentListener);
    },

    updatePosts(posts) {
        this.posts = [];

        posts.forEach((postData) => {
            var post = postData.val();
            post.id = postData.key();
            this.posts.unshift(post);
        });

        this.triggerAll();
    },

    updateComments(comments) {
        this.comments = [];

        comments.forEach((commentData) => {
            var comment = commentData.val();
            comment.id = commentData.key();
            this.comments.unshift(comment);
        });

        this.triggerAll();
    },

    triggerAll () {
        this.trigger({
            userId: this.userId,
            posts: this.posts,
            comments: this.comments
        });
    },

    getDefaultData() {
        return {
            userId: this.userId,
            posts: this.posts,
            comments: this.comments
        };
    }
});

module.exports = profileStore;
