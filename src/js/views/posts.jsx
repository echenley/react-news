'use strict';

var Reflux = require('reflux');
var Actions = require('../actions/Actions');

var PostsStore = require('../stores/PostsStore');

var Spinner = require('../components/Spinner');
var Post = require('../components/Post');
var Router = require('react-router');
var Link = Router.Link;

var Posts = React.createClass({

    propTypes: {
        user: React.PropTypes.object
    },

    mixins: [
        Router.Navigation,
        Reflux.listenTo(PostsStore, 'onStoreUpdate')
    ],

    statics: {
        willTransitionTo(transition, params) {
            Actions.listenToPosts(+params.pageNum || 1);
        },

        willTransitionFrom() {
            Actions.stopListeningToPosts();
        }
    },

    getInitialState() {
        var postsData = PostsStore.getDefaultData();
        return {
            loading: true,
            posts: postsData.posts,
            sortOptions: postsData.sortOptions,
            nextPage: postsData.nextPage,
            currentPage: postsData.currentPage
        };
    },

    onStoreUpdate(postsData) {
        if (!postsData.posts.length) {
            // if no posts are returned
            this.transitionTo('home');
        }
        this.setState({
            loading: false,
            posts: postsData.posts,
            sortOptions: postsData.sortOptions,
            nextPage: postsData.nextPage,
            currentPage: postsData.currentPage
        });
    },

    updateSortBy(e) {
        e.preventDefault();
        var currentPage = this.state.currentPage || 1;

        Actions.setSortBy(this.refs.sortBy.getDOMNode().value);

        this.setState({
            loading: true
        });

        if (currentPage === 1) {
            Actions.stopListeningToPosts();
            Actions.listenToPosts(currentPage);
        } else {
            this.transitionTo('posts', { pageNum: 1 });
        }
    },

    render() {
        var posts = this.state.posts;
        var currentPage = this.state.currentPage || 1;
        var sortOptions = this.state.sortOptions;
        // possible sort values (defined in PostsStore)
        var sortValues = Object.keys(sortOptions.values);
        var user = this.props.user;

        posts = posts.map(function(post) {
            return <Post post={ post } user={ user } key={ post.id } />;
        });

        var options = sortValues.map(function(optionText, i) {
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
                            <Link to="posts" params={{ pageNum: currentPage + 1 }} className="next-page">
                                Load More Posts
                            </Link>
                          ) : 'No More Posts'
                    }
                </nav>
            </div>
        );
    }

});

module.exports = Posts;
