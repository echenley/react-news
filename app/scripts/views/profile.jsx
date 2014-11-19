'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var Navigation = require('react-router').Navigation;

// actions
var userActions = require('../actions/userActions');
var postActions = require('../actions/postActions');
var commentActions = require('../actions/commentActions');

// stores
// var postStore = require('../stores/postStore');
// var commentStore = require('../stores/commentStore');
var profileStore = require('../stores/profileStore');
var userStore = require('../stores/userStore');

// components
var Spinner = require('react-spinner');
var Post = require('../components/post');
var Comment = require('../components/comment');

var Profile = React.createClass({

    mixins: [
        Navigation,
        Reflux.listenTo(profileStore, 'onLoaded')
    ],

    getInitialState: function () {
        return {
        	profileUserId: '',
        	posts: [],
        	comments: [],
        	isLoading: true,
        };
    },

    onLoaded: function (posts, comments) {
    	this.setState({
    		posts: posts,
    		comments: comments,
    		isLoading: false
    	});
    },

    componentWillMount: function() {
    	var username = this.props.params.username;
        // sets callback to watch current user's posts

        userStore.getUserId(username).then(function (userId) {
	        postActions.listenToUser(userId);
	        commentActions.listenToUser(userId);
	        this.setState({
	        	profileUserId: userId
	        });
        }.bind(this));
    },

    componentWillUnmount: function () {
        postActions.stopListening();
        commentActions.stopListening();
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
        	'hidden': user.uid !== this.state.profileUserId
        });

        return (
            <div className="content inner fade-in">
                <div className={ logoutCx }>
                    <button onClick={ this.logout } className="button button-primary">Sign Out</button>
                </div>
	            <h1>{ this.props.params.username + '\'s' } Profile</h1>
                <div className="user-posts">
                    <h2>{ posts.length ? 'Latest' : 'No'} Posts</h2>
	                {
	                	posts.map(function (post) {
			        		return <Post post={ post } user={ user } key={ post.id } />;
			        	})
	                }
                </div>
                <div className="user-comments">
                    <h2>{ comments.length ? 'Latest' : 'No'} Comments</h2>
	                {
	                	comments.map(function (comment) {
			        		return <Comment comment={ comment } user={ user } key={ comment.id } />;
			        	})
	                }
                </div>
            </div>
        );
    }

});

module.exports = Profile;