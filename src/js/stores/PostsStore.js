'use strict';

import Reflux from 'reflux';
import Firebase from 'firebase';
import Actions from '../actions/Actions';
import { firebaseUrl } from '../util/constants';

let baseRef = new Firebase(firebaseUrl);
let postsRef = baseRef.child('posts');
// let scrollRef = new Firebase.util.Scroll(baseRef, 'number');

let postsPerPage = 10;

const sortValues = {
    // values mapped to firebase locations at baseRef/posts
    upvotes: 'upvotes',
    newest: 'time',
    comments: 'commentCount'
};

let data = {
    posts: [],
    currentPage: 1,
    nextPage: true,
    sortOptions: {
        currentValue: 'upvotes',
        values: sortValues
    }
};

const PostsStore = Reflux.createStore({

    listenables: Actions,

    // init() {
    //     scrollRef.on('child_added', this.appendPosts);
    // },

    setSortBy(value) {
        data.sortOptions.currentValue = value;
    },

    watchPosts(pageNum) {
        data.currentPage = pageNum;
        postsRef
            .orderByChild(sortValues[data.sortOptions.currentValue])
            // +1 extra post to determine whether another page exists
            .limitToLast((data.currentPage * postsPerPage) + 1)
            .on('value', this.updatePosts);
    },

    stopWatchingPosts() {
        postsRef.off();
    },

    updatePosts(postDataObj) {
        // newPosts will be all posts through current page + 1
        let endAt = data.currentPage * postsPerPage;

        // add posts to new array
        let newPosts = [];

        postDataObj.forEach(postData => {
            let post = postData.val();
            post.id = postData.key();
            newPosts.unshift(post);
        });

        // if extra post doesn't exist, indicate that there are no more posts
        data.nextPage = (newPosts.length === endAt + 1);

        // slice off extra post
        data.posts = newPosts.slice(0, endAt);

        this.trigger(data);
    },

    getDefaultData() {
        return data;
    }

});

export default PostsStore;
