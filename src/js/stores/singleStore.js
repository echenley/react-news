'use strict';

var Reflux = require('reflux');
var Actions = require('../actions/Actions');

var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
var postsRef = ref.child('posts');
var commentsRef = ref.child('comments');

var postData = {
    post: {},
    comments: []
};

var SingleStore = Reflux.createStore({

    listenables: Actions,

    listenToPost(postId) {
        postsRef
            .child(postId)
            .once('value', this.updatePost.bind(this));

        commentsRef
            .orderByChild('postId')
            .equalTo(postId)
            .once('value', this.updateComments.bind(this));
    },

    updatePost(postDataObj) {
        var post = postDataObj.val();

        if (post) {
            post.id = postDataObj.key();
            postData.post = post;
        } else {
            // post doesn't exist or was deleted
            postData.post = {
                isDeleted: true
            };
        }

        this.trigger(postData);
    },

    updateComments(comments) {
        postData.comments = [];

        comments.forEach(commentData => {
            var comment = commentData.val();
            comment.id = commentData.key();
            postData.comments.unshift(comment);
        });

        this.trigger(postData);
    },

    getDefaultData() {
        return postData;
    }

});

module.exports = SingleStore;
