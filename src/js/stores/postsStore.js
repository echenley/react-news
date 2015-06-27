'use strict';

import Reflux from 'reflux';
import Firebase from 'firebase';
import Actions from '../actions/Actions';

// import '../vendor/firebase-util';

let baseRef = new Firebase('https://resplendent-fire-4810.firebaseio.com');
let postsRef = baseRef.child('posts');

let postsPerPage = 10;

const sortValues = {
    // values mapped to firebase locations
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

    setSortBy(value) {
        data.sortOptions.currentValue = value;
    },

    watchPosts(pageNum) {
        data.currentPage = pageNum;
        postsRef
            .orderByChild(data.sortOptions.values[data.sortOptions.currentValue])
            // +1 extra post to determine whether another page exists
            .limitToLast((data.currentPage * postsPerPage) + 1)
            .on('value', postDataObj => this.updatePosts(postDataObj));
    },

    stopWatchingPosts() {
        postsRef.off();
    },

    updatePosts(postDataObj) {
        // newPosts will be all posts through current page + 1
        var endAt = data.currentPage * postsPerPage;

        // accumulate posts in posts array
        var newPosts = [];

        postDataObj.forEach(postData => {
            var post = postData.val();
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
