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
        Reflux.connect(postsStore, 'posts')
    ],

    getInitialState: function () {
        return {
            posts: [],
            sortBy: 'upvotes'
        };
    },

    componentWillMount: function () {
    	actions.listenToPosts(this.state.sortBy);
    },

    componentWillUnmount: function () {
    	actions.stopListeningToPosts();
    },

    render: function () {
        var posts = this.state.posts;
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

        return (
            <div className="content inner fade-in">
                { posts }
            </div>
        );
    }

});

module.exports = Posts;