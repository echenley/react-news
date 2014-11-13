'use strict';

var Reflux = require('reflux');
// var postActions = require('../actions/postActions');


var Firebase = require('firebase');
var postsRef = new Firebase('https://resplendent-fire-4810.firebaseio.com/posts');

var postStore = Reflux.createStore({

    init: function () {
        this.posts = {};

        postsRef.on('value', function (posts) {
            this.posts = posts.val();
            this.trigger(this.posts);
        }.bind(this));
    },

    getDefaultData: function () {
        return this.posts;
    }

});

module.exports = postStore;















