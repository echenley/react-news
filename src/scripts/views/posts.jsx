'use strict';

var Reflux = require('reflux');

// actions
var actions = require('../actions/actions');

// stores
var postsStore = require('../stores/postsStore');

// components
var Spinner = require('../components/spinner');
var Post = require('../components/post');
var Router = require('react-router');
var Link = Router.Link;

var Posts = React.createClass({

    mixins: [
        Router.Navigation,
        Reflux.listenTo(postsStore, 'onStoreUpdate')
    ],

    getInitialState: function () {
        var postsData = postsStore.getDefaultData();
        return {
            loading: true,
            posts: postsData.posts,
            sortOptions: postsData.sortOptions,
            nextPage: postsData.nextPage,
            currentPage: postsData.currentPage
        };
    },

    statics: {

        willTransitionTo: function (transition, params) {
            actions.listenToPosts(+params.pageNum || 1);
        },

        willTransitionFrom: function (transition, component) {
            actions.stopListeningToPosts();
            component.setState({
                loading: true
            });
        }
        
    },

    onStoreUpdate: function (postsData) {
        this.setState({
            loading: false,
            posts: postsData.posts,
            sortOptions: postsData.sortOptions,
            nextPage: postsData.nextPage,
            currentPage: postsData.currentPage
        });
    },

    updateSortBy: function (e) {
        e.preventDefault();
        var currentPage = this.state.currentPage || 1;
        
        actions.setSortBy(this.refs.sortBy.getDOMNode().value);

        this.setState({
            loading: true
        });

        if (currentPage === 1) {
            actions.stopListeningToPosts();
            actions.listenToPosts(currentPage);
        } else {
            this.transitionTo('posts', { pageNum: 1 });
        }
    },

    render: function () {
        var posts = this.state.posts;
        var currentPage = this.state.currentPage || 1;
        var sortOptions = this.state.sortOptions;
        // possible sort values (defined in postsStore)
        var sortValues = Object.keys(sortOptions.values);
        var user = this.props.user;

        posts = posts.map(function (post) {
            return <Post post={ post } user={ user } key={ post.id } />;
        });

        var options = sortValues.map(function (optionText, i) {
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
                        ref="sortBy">
                        { options }
                    </select>
                </div>
                <hr />
                <div className="posts">
                    { this.state.loading ? <Spinner /> : posts }
                </div>
                <hr />
                <nav className="pagination cf">
                    { currentPage > 1 && <Link to="posts" params={{ pageNum: currentPage - 1 }} className="previous-page float-left">Previous</Link> }
                    { this.state.nextPage && <Link to="posts" params={{ pageNum: currentPage + 1 }} className="next-page float-right">Next</Link> }
                </nav>
            </div>
        );
    }

});

module.exports = Posts;