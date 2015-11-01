'use strict';

import Reflux from 'reflux';
import Firebase from 'firebase';
import { firebaseUrl } from '../util/constants';

// used to create email hash for gravatar
import md5 from 'md5';

const baseRef = new Firebase(firebaseUrl);
const commentsRef = baseRef.child('comments');
const postsRef = baseRef.child('posts');
const usersRef = baseRef.child('users');

const Actions = Reflux.createActions([
    // user actions
    'login',
    'logout',
    'register',
    'updateLatestPost',
    // post actions
    'upvotePost',
    'downvotePost',
    'submitPost',
    'deletePost',
    'setSortBy',
    // comment actions
    'upvoteComment',
    'downvoteComment',
    'updateCommentCount',
    'addComment',
    'deleteComment',
    // comment form actions
    'commentFormError',
    'clearCommentFormError',
    // firebase actions
    'watchPost',
    'watchPosts',
    'watchProfile',
    'stopWatchingPost',
    'stopWatchingPosts',
    'stopWatchingProfile',
    // modal actions
    'showModal',
    'hideModal',
    'modalError'
]);

/* User Actions
=============================== */

Actions.login.listen((loginData) => {
    baseRef.authWithPassword(loginData, (error) => (
        error ? Actions.modalError(error.code) : Actions.hideModal()
    ));
});

function createUser(username, loginData) {
    let profile = {
        username: username,
        md5hash: md5(loginData.email)
    };

    baseRef.createUser(loginData, (error, userData) => {
        if (error) {
            // email taken, other login errors
            return Actions.modalError(error.code);
        }

        // user successfully created
        // add user profile then log them in
        usersRef.child(userData.uid).set(profile, err => err || Actions.login(loginData));
    });
}

Actions.register.listen((username, loginData) => {
    // check if username is already taken
    usersRef.orderByChild('username').equalTo(username).once('value', (user) => {
        if (user.val()) {
            // username is taken
            Actions.modalError('USERNAME_TAKEN');
        } else {
            // username is available
            createUser(username, loginData);
        }
    });
});


/* Post Actions
=============================== */

Actions.submitPost.listen(function(post) {
    let newPostRef = postsRef.push(post, (error) => {
        if (error) { return Actions.modalError(error); }

        let postId = newPostRef.key();
        // add commentId to user's profile
        usersRef
            .child(`${post.creatorUID}/submitted/${postId}`)
            .set(true, () => Actions.updateLatestPost(postId));
    });
});

Actions.deletePost.listen((post) => {
    postsRef.child(post.id).set({ isDeleted: true }, (error) => {
        if (error) { return; }

        // remove commentId from user's profile
        usersRef.child(`${post.creatorUID}/submitted/${post.id}`).remove();
    });
});

/*
    I debated for a while here about whether it's okay to trust these
    callbacks to keep things in sync. I looked at Firebase Util (still very
    beta as of June 2015) and Firebase Multi Write but decided that the extra
    dependencies were probably overkill for this project. If you need more
    guarantees that the data will stay in sync, check them out:

    https://github.com/firebase/firebase-util
    https://github.com/katowulf/firebase-multi-write
*/

function updatePostUpvotes(postId, n) {
    postsRef.child(`${postId}/upvotes`).transaction(curr => (curr || 0) + n);
}

/*
    I had this callback backwards at first. It's important to update the
    user's profile first since each time Firebase pushes changes the UI will
    update. Thus, there was a tiny period during which the upvote was
    registered for the post, but not for the user, meaning the user could get
    multiple up/downvotes in before the UI updated for the second time. The
    same is true for up/downvoteComment.
*/

Actions.upvotePost.listen((userId, postId) => {
    // set upvote in user's profile
    usersRef.child(`${userId}/upvoted/${postId}`).set(true, (error) => {
        if (error) { return; }
        // increment post's upvotes
        updatePostUpvotes(postId, 1);
    });
});

Actions.downvotePost.listen((userId, postId) => {
    // remove upvote from user's profile
    usersRef.child(`${userId}/upvoted/${postId}`).remove((error) => {
        if (error) { return; }
        // decrement post's upvotes
        updatePostUpvotes(postId, -1);
    });
});


/* Comment Actions
=============================== */

function updateCommentUpvotes(commentId, n) {
    commentsRef.child(`${commentId}/upvotes`).transaction(curr => (curr || 0) + n);
}

Actions.upvoteComment.listen((userId, commentId) => {
    // set upvote in user's profile
    usersRef.child(`${userId}/upvoted/${commentId}`).set(true, (error) => {
        if (error) { return; }
        // increment comment's upvotes
        updateCommentUpvotes(commentId, 1);
    });
});

Actions.downvoteComment.listen((userId, commentId) => {
    // remove upvote from user's profile
    usersRef.child(`${userId}/upvoted/${commentId}`).remove((error) => {
        if (error) { return; }
        // decrement comment's upvotes
        updateCommentUpvotes(commentId, -1);
    });
});

function updateCommentCount(postId, n) {
    // updates comment count on post
    postsRef.child(`${postId}/commentCount`).transaction(curr => (curr || 0) + n);
}

Actions.addComment.listen((comment) => {
    let newCommentRef = commentsRef.push(comment, (error) => {
        if (error) {
            return Actions.commentFormError('COMMENT_FAILED');
        }

        Actions.clearCommentFormError();

        updateCommentCount(comment.postId, 1);

        // add commentId to user's profile
        usersRef.child(`${comment.creatorUID}/submitted/${newCommentRef.key()}`).set(true);
    });
});

Actions.deleteComment.listen((comment) => {
    commentsRef.child(comment.id).remove((error) => {
        if (error) { return; }

        updateCommentCount(comment.postId, -1);

        // remove commentId from user's profile
        usersRef.child(`${comment.creatorUID}/submitted/${comment.id}`).remove();
    });
});

export default Actions;
