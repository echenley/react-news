'use strict';

import Reflux from 'reflux';
import Actions from '../actions/Actions';
import { firebaseUrl } from '../util/constants';

import Firebase from 'firebase';

const ref = new Firebase(firebaseUrl);
const postsRef = ref.child('posts');
const commentsRef = ref.child('comments');

// store listener references
let postListener, commentListener;

let data = {
    userId: '',
    posts: [],
    comments: []
};

const ProfileStore = Reflux.createStore({

    listenables: Actions,

    watchProfile(id) {
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

    stopWatchingProfile() {
        postsRef.off('value', postListener);
        commentsRef.off('value', commentListener);
    },

    updatePosts(postDataObj) {
        let newPosts = [];

        // postDataObj: firebase object with a forEach property
        postDataObj.forEach(postData => {
            let post = postData.val();
            post.id = postData.key();
            newPosts.unshift(post);
        });

        data.posts = newPosts;

        this.trigger(data);
    },

    updateComments(commentDataObj) {
        let newComments = [];

        // commentDataObj: firebase object with a forEach property
        commentDataObj.forEach(commentData => {
            let comment = commentData.val();
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

export default ProfileStore;
