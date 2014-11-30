'use strict';

var React = require('react/addons');

var Reflux = require('reflux');

// actions
var actions = require('../actions/actions');

// stores
var postsStore = require('../stores/postsStore');

// components
var Spinner = require('react-spinner');
var Post = require('../components/post');

var Posts = React.createClass({

    mixins: [
        Reflux.listenTo(postsStore, 'onStoreUpdate')
    ],

    getInitialState: function () {
        var postsData = postsStore.getDefaultData();
        return {
            posts: postsData.posts,
            sortOptions: postsData.sortOptions,
            loading: true
        };
    },

    onStoreUpdate: function (postsData) {
        this.setState({
            posts: postsData.posts,
            sortOptions: postsData.sortOptions,
            loading: false
        });
    },

    componentWillMount: function () {
        // triggers listenToPosts
        actions.setSortBy(this.state.sortOptions.currentIndex);
    },

    componentWillUnmount: function () {
        actions.stopListeningToPosts();
    },

    updateSortBy: function (e) {
        e.preventDefault();
        var sortOptions = this.state.sortOptions;
        sortOptions.currentIndex = this.refs.sortBy.getDOMNode().selectedIndex;
        this.setState({
            loading: true,
            sortOptions: sortOptions
        });
        actions.setSortBy(sortOptions.currentIndex);
    },

    render: function () {
        var posts = this.state.posts;
        var sortOptions = this.state.sortOptions;
        var user = this.props.user;

        // if state is unresolved, render a spinner
        if (posts.length === 0) {
            return (
                <div className="content">
                    <Spinner />
                </div>
            );
        }

        posts = posts.map(function (post) {
            return <Post post={ post } user={ user } key={ post.id } />;
        });

        var options = sortOptions.values.map(function (optionText, i) {
            return <option value={ i } key={ i }>{ optionText }</option>;
        });

        return (
            <div className="content inner fade-in">
                <label htmlFor="sortby-select" className="sortby-label">Sort by </label>
                <div className="sortby">
                    <select id="sortby-select" className="sortby-select" onChange={ this.updateSortBy } value={ sortOptions.currentIndex } ref="sortBy">
                        { options }
                    </select>
                </div>
                <hr />
                { this.state.loading ? <Spinner /> : posts }
            </div>
        );
    }

});

module.exports = Posts;