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
        return postsStore.getDefaultData();
    },

    onStoreUpdate: function (postsData) {
        this.setState(postsData);
    },

    componentWillMount: function () {
        // triggers listenToPosts
        actions.setSortBy(this.state.sortOptions.currentIndex);
    },

    componentWillUnmount: function () {
        actions.stopListeningToPosts();
    },

    updateSortby: function (e) {
        e.preventDefault();
        actions.setSortBy(this.refs.sortBy.getDOMNode().selectedIndex);
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
                <div className="sortby">
                    <label htmlFor="sortby-select">Sort by </label>
                    <select id="sortby-select" onChange={ this.updateSortby } value={ sortOptions.currentIndex } ref="sortBy">
                        { options }
                    </select>
                </div>
                <hr />
                { posts }
            </div>
        );
    }

});

module.exports = Posts;