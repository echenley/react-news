'use strict';

var Reflux = require('reflux');
var historyActions = require('../actions/historyActions');

var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-4810.firebaseio.com/');
var historyRef = ref.child('user_history');
var postsRef = ref.child('posts');
// var commentsRef = ref.child('comments');

var postStore = Reflux.createStore({

    listenables: historyActions,

    init: function () {
        this.history = {
            posts: {},
            comments: {}
        };
    },

    getPosts: function (userId, count) {
        postsRef
            .orderByChild('creatorUID')
            .startAt(userId)
            .limitToFirst(count)
            .on('value', function (posts) {
                this.history.posts = posts.val();
                this.trigger(this.history);
            }.bind(this));
    },

    // getComments: function (userId, count) {
    //     commentsRef
    //         .orderByChild('creatorUID')
    //         .startAt(userId)
    //         .limitToFirst(count)
    //         .on('value', function (posts) {
    //             this.history.posts = posts.val();
    //             this.trigger(this.history);
    //         }.bind(this));
    // },

    setFirebaseCallback: function (userId) {
        // dynamically sets callback to watch current post's comments
        // called on componentWillMount
        historyRef.child(userId).on('value', function (historySnapshot) {
            if (historySnapshot.numChildren()) {
                var postCount = Object.keys(historySnapshot.child('posts').val()).length;
                this.getPosts(userId, postCount);
            }
            // var commentCount
            // this.getComments(historyRefs.comments);
        }.bind(this));
    },

    removeFirebaseCallback: function (userId) {
        historyRef.child(userId).off('value');
    },

    getDefaultData: function () {
        return this.history;
    }

});

module.exports = postStore;















