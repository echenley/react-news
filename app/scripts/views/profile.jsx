'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var Navigation = require('react-router').Navigation;

var userActions = require('../actions/userActions');
var postActions = require('../actions/postActions');

var postStore = require('../stores/postStore');
var commentStore = require('../stores/commentStore');

// components
var Spinner = require('react-spinner');
var Post = require('../components/post');
// var Comment = require('../components/comment');

var Profile = React.createClass({

    mixins: [
        Navigation,
        Reflux.listenTo(postStore, 'onLoaded'),
        Reflux.connect(commentStore, 'comment')
    ],

    getInitialState: function () {
        return {
        	posts: [],
        	comments: [],
        	isLoading: true,
        };
    },

    onLoaded: function (posts) {
    	this.setState({
    		posts: posts,
    		isLoading: false
    	});
    },

    componentWillMount: function() {
        // sets callback to watch current user's posts
        postActions.listenToUser(this.props.params.userId);
        // commentActions.listenToUser(this.props.params.userId);
    },

    componentWillUnmount: function () {
        postActions.stopListening();
        // commentActions.stopListening();
    },

    logout: function (e) {
        e.preventDefault();
        userActions.logout();
        this.transitionTo('home');
    },

    render: function() {
    	var cx = React.addons.classSet;
        var user = this.props.user;
        var posts = this.state.posts;
        var comments = this.state.comments;

        if (this.state.isLoading) {
            return (
	            <div className="content">
	                <Spinner />
	            </div>
	        );
        }

        var logoutCx = cx({
        	'user-options': true,
        	'float-right': true,
        	'hidden': user.uid !== this.props.params.userId
        });

        return (
            <div className="content inner">
                <div className={ logoutCx }>
                    <button onClick={ this.logout } className="button button-primary">Sign Out</button>
                </div>
	            <h1>Profile</h1>
                <div className="user-posts">
                    <h2>Posts</h2>
	                {
	                	posts.map(function (post) {
			        		return <Post post={ post } user={ user } key={ post.id } />;
			        	})
	                }
                </div>
                <div className="user-comments">
                    <h2>Comments</h2>
                    { comments }
                </div>
            </div>
        );
    }

});

module.exports = Profile;