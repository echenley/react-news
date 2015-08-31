'use strict';

import Reflux from 'reflux';
import Actions from '../actions/Actions';
import { firebaseUrl } from '../util/constants';

import Firebase from 'firebase';
const ref = new Firebase(firebaseUrl);
const postsRef = ref.child('posts');
const commentsRef = ref.child('comments');

let postData = {
    post: {},
    comments: []
};

const SingleStore = Reflux.createStore({

    listenables: Actions,

    watchPost(postId) {
        postsRef
            .child(postId)
            .on('value', this.updatePost.bind(this));

        commentsRef
            .orderByChild('postId')
            .equalTo(postId)
            .on('value', this.updateComments.bind(this));
    },

    stopWatchingPost(postId) {
        postsRef.child(postId).off();
        commentsRef.orderByChild('postId').equalTo(postId).off();
    },

    updatePost(postDataObj) {
        let post = postDataObj.val();

        if (!post) {
            // post doesn't exist
            postData.post = null;
        } else {
            post.id = postDataObj.key();
            postData.post = post;
        }

        this.trigger(postData);
    },

    updateComments(commentDataObj) {
        let newComments = [];

        commentDataObj.forEach(commentData => {
            let comment = commentData.val();
            comment.id = commentData.key();
            newComments.unshift(comment);
        });

        postData.comments = newComments;

        this.trigger(postData);
    },

    getDefaultData() {
        return postData;
    }

});

export default SingleStore;
