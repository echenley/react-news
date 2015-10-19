'use strict';

import React, { PropTypes } from 'react';
import Reflux from 'reflux';
import Actions from '../actions/Actions';
import { History } from 'react-router';

import PostsStore from '../stores/PostsStore';
import UserStore from '../stores/UserStore';

import Spinner from '../components/Spinner';
import Post from '../components/Post';
import Link from 'react-router/lib/Link';

const Posts = React.createClass({

    propTypes: {
        params: PropTypes.object
    },

    mixins: [
        History,
        Reflux.listenTo(PostsStore, 'onStoreUpdate'),
        Reflux.connect(UserStore, 'user')
    ],

    getInitialState() {
        const postsData = PostsStore.getDefaultData();

        return {
            user: UserStore.getDefaultData(),
            loading: true,
            posts: postsData.posts,
            sortOptions: postsData.sortOptions,
            nextPage: postsData.nextPage,
            currentPage: postsData.currentPage
        };
    },

    componentDidMount() {
        const { pageNum } = this.props.params;

        if (isNaN(pageNum) || pageNum < 1) {
            this.history.pushState(null, '/404');
            return;
        }

        Actions.watchPosts(pageNum);
    },

    componentWillReceiveProps(nextProps) {
        const { pageNum } = nextProps.params;

        if (isNaN(pageNum) || pageNum < 1) {
            this.history.pushState(null, '/404');
            return;
        }

        Actions.stopWatchingPosts();
        Actions.watchPosts(pageNum);
    },

    componentWillUnmount() {
        Actions.stopWatchingPosts();
    },

    onStoreUpdate(postsData) {
        this.setState({
            loading: false,
            posts: postsData.posts,
            sortOptions: postsData.sortOptions,
            nextPage: postsData.nextPage,
            currentPage: +postsData.currentPage
        });
    },

    updateSortBy(e) {
        e.preventDefault();
        const { sortOptions } = this.state;
        const currentPage = this.state.currentPage || 1;
        const sortByValue = e.target.value;

        // optimistically update selected option
        sortOptions.currentValue = sortByValue;

        this.setState({
            loading: true,
            sortOptions: sortOptions
        });

        Actions.setSortBy(sortByValue);

        if (currentPage !== 1) {
            this.history.pushState(null, '/posts/1');
        } else {
            Actions.stopWatchingPosts();
            Actions.watchPosts(currentPage);
        }
    },

    render() {
        const { loading, nextPage, user, posts, sortOptions } = this.state;
        const currentPage = this.state.currentPage || 1;

        // possible sort values (defined in PostsStore)
        const sortValues = Object.keys(sortOptions.values);

        const options = sortValues.map((optionText, i) => (
            <option value={ sortOptions[i] } key={ i }>{ optionText }</option>
        ));

        const postEls = posts.length
            ? posts.map((post) => (
                <Post post={ post } user={ user } key={ post.id } />)
            )
            : 'There are no posts yet!';

        return (
            <div className="content full-width">
                <label htmlFor="sortby-select" className="sortby-label">Sort by </label>
                <div className="sortby">
                    <select
                        id="sortby-select"
                        className="sortby-select"
                        onChange={ this.updateSortBy }
                        value={ sortOptions.currentValue }
                        ref="sortBy"
                    >
                        { options }
                    </select>
                </div>
                <hr />
                <div className="posts">
                    { loading ? <Spinner /> : postEls }
                </div>
                <hr />
                <nav className="pagination">
                    {
                        nextPage ? (
                            <Link to={ `/posts/${currentPage + 1}` } className="next-page">
                                Load More Posts
                            </Link>
                          ) : 'No More Posts'
                    }
                </nav>
            </div>
        );
    }

});

export default Posts;
