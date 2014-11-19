'use strict';

var React = require('react/addons');

var Reflux = require('reflux');
var postStore = require('../stores/postStore');
var postActions = require('../actions/postActions');

// var userActions = require('../actions/userActions');

// components
var Spinner = require('react-spinner');
var Post = require('../components/post');

var Posts = React.createClass({

    mixins: [
        Reflux.listenTo(postStore, 'onLoaded')
    ],

    getInitialState: function () {
        return {
            posts: [],
            isLoading: true
        };
    },

    onLoaded: function (posts) {
    	this.setState({
    		posts: posts,
    		isLoading: false
    	});
    },

    componentWillMount: function () {
    	var postsPerPage = 10;
    	postActions.listenToAll(postsPerPage);
    },

    componentWillUnmount: function () {
        postActions.stopListening();
    },

    render: function() {
        var posts = this.state.posts;
        var user = this.props.user;

        // if state is unresolved, render a spinner
        if (this.state.isLoading) {
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