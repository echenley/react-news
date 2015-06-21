'use strict';

var Reflux = require('reflux');
var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
var postsRef = ref.child('posts');
var commentsRef = ref.child('comments');
var Actions = require('../actions/Actions');

// store listener references
var postListener, commentListener;

var data = {
    userId: '',
    posts: [],
    comments: []
};

var ProfileStore = Reflux.createStore({

    listenables: Actions,

    listenToProfile(id) {
        data.userId = id;

        postListener = postsRef
            .orderByChild('creatorUID')
            .equalTo(data.userId)
            .limitToLast(3)
            .on('value', this.updatePosts.bind(this));

        commentListener = commentsRef
            .orderByChild('creatorUID')
            .equalTo(data.userId)
            .limitToLast(3)
            .on('value', this.updateComments.bind(this));
    },

    stopListeningToProfile() {
        postsRef.off('value', postListener);
        commentsRef.off('value', commentListener);
    },

    updatePosts(postDataObj) {
        var newPosts = [];

        // postDataObj: firebase object with a forEach property
        postDataObj.forEach(postData => {
            var post = postData.val();
            post.id = postData.key();
            newPosts.unshift(post);
        });

        data.posts = newPosts;

        this.trigger(data);
    },

    updateComments(commentDataObj) {
        var newComments = [];

        // commentDataObj: firebase object with a forEach property
        commentDataObj.forEach(commentData => {
            var comment = commentData.val();
            comment.id = commentData.key();
            newComments.unshift(comment);
        });

        data.comments = newComments;

        this.trigger(data);
    },

    getDefaultData() {
        return data;
    }
});

module.exports = ProfileStore;
