'use strict';

import React from 'react/addons';
import Reflux from 'reflux';
import Actions from '../actions/Actions';
import { Navigation, TransitionHook } from 'react-router';

import PostsStore from '../stores/PostsStore';
import UserStore from '../stores/UserStore';

import Spinner from '../components/Spinner';
import Post from '../components/Post';
import Link from 'react-router/lib/Link';

const Posts = React.createClass({

    propTypes: {
        params: React.PropTypes.object
    },

    mixins: [
        TransitionHook,
        Navigation,
        Reflux.listenTo(PostsStore, 'onStoreUpdate'),
        Reflux.connect(UserStore, 'user')
    ],

    getInitialState() {
        let postsData = PostsStore.getDefaultData();

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
        let pageNum = this.props.params.pageNum || 1;
        Actions.watchPosts(pageNum);
    },

    componentWillReceiveProps(nextProps) {
        let pageNum = nextProps.params.pageNum || 1;
        Actions.stopWatchingPosts();
        Actions.watchPosts(pageNum);
    },

    routerWillLeave() {
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
        let currentPage = this.state.currentPage || 1;
        let sortByValue = React.findDOMNode(this.refs.sortBy).value;

        // optimistically update selected option
        let sortOptions = this.state.sortOptions;
        sortOptions.currentValue = sortByValue;

        this.setState({
            loading: true,
            sortOptions: sortOptions
        });

        Actions.setSortBy(sortByValue);

        if (currentPage !== 1) {
            this.transitionTo('/posts/1');
        } else {
            Actions.stopWatchingPosts();
            Actions.watchPosts(currentPage);
        }
    },

    render() {
        let user = this.state.user;
        let posts = this.state.posts;
        let currentPage = this.state.currentPage || 1;
        let sortOptions = this.state.sortOptions;
        // possible sort values (defined in PostsStore)
        let sortValues = Object.keys(sortOptions.values);

        if (posts.length) {
            posts = posts.map(function(post) {
                return <Post post={ post } user={ user } key={ post.id } />;
            });
        } else {
            posts = 'There are no posts yet!';
        }

        // posts.push(<Post type={ default } />)

        let options = sortValues.map(function(optionText, i) {
            return <option value={ sortOptions[i] } key={ i }>{ optionText }</option>;
        });

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
                    { this.state.loading ? <Spinner /> : posts }
                </div>
                <hr />
                <nav className="pagination">
                    {
                        this.state.nextPage ? (
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
