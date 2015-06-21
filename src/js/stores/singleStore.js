'use strict';

var Reflux = require('reflux');
var Actions = require('../actions/Actions');

var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
var postsRef = ref.child('posts');
var commentsRef = ref.child('comments');

// store listener references
var postListener, commentListener;

var SingleStore = Reflux.createStore({

    listenables: Actions,

    init() {
        this.postData = {
            post: {},
            comments: []
        };
    },

    listenToPost(postId) {
        postListener = postsRef
            .child(postId)
            .on('value', this.updatePost.bind(this));

        commentListener = commentsRef
            .orderByChild('postId')
            .equalTo(postId)
            .on('value', this.updateComments.bind(this));
    },

    updatePost(postData) {
        var post = postData.val();

        if (post) {
            post.id = postData.key();
            this.postData.post = post;
        } else {
            // post doesn't exist or was deleted
            this.postData.post = {
                isDeleted: true
            };
        }

        this.trigger(this.postData);
    },

    updateComments(comments) {
        this.postData.comments = [];

        comments.forEach((commentData) => {
            var comment = commentData.val();
            comment.id = commentData.key();
            this.postData.comments.unshift(comment);
        });

        this.trigger(this.postData);
    },

    stopListeningToPost(postId) {
        if (!this.postData.post.isDeleted) {
            postsRef.child(postId)
                .off('value', postListener);
        }

        commentsRef.off('value', commentListener);
    },

    getDefaultData() {
        return this.postData;
    }

});

module.exports = SingleStore;
