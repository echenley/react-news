'use strict';

var React = require('react/addons');

var Reflux = require('reflux');
var postStore = require('../stores/postStore');
var postActions = require('../actions/postActions');

// var userActions = require('../actions/userActions');

var Post = require('../components/post');

var Posts = React.createClass({

    mixins: [
        Reflux.connect(postStore, 'posts')
    ],

    getInitialState: function () {
        return {
            posts: []
        };
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

        // if state is unresolved, don't render
        if (posts.length === 0) {
            return false;
        }

        return (
            <div className="content inner">
                {
                	posts.map(function (post) {
		        		return <Post post={ post } user={ user } key={ post.id } />;
		        	})
                }
            </div>
        );
    }

});

module.exports = Posts;