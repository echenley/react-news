'use strict';

var Reflux = require('reflux');

var postStore = require('../stores/postStore');
var commentStore = require('../stores/commentStore');
var profileData = Reflux.all(postStore, commentStore);

var profileStore = Reflux.createStore({

    init: function () {
        this.listenTo(profileData, this._updateProfile.bind(this));
    },

    _updateProfile: function (posts, comments) {
        this.trigger.apply(this, posts.concat(comments));
    },
});

module.exports = profileStore;