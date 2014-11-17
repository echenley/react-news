'use strict';

var $ = jQuery;
var React = require('react/addons');
var Reflux = require('reflux');
var Navigation = require('react-router').Navigation;

var userActions = require('../actions/userActions');
var historyActions = require('../actions/historyActions');

var historyStore = require('../stores/historyStore');
// var userStore = require('../stores/userStore');

var Post = require('../components/post');
// var Comment = require('../components/comment');

var Profile = React.createClass({

    mixins: [
        Navigation,
        Reflux.connect(historyStore, 'history')
    ],

    getInitialState: function () {
        return {
            history: {}
        };
    },

    componentWillMount: function() {
        // sets callback to watch current user's posts
        historyActions.setFirebaseCallback(this.props.params.userId);
    },

    componentWillUnmount: function () {
        // removes 
        historyActions.removeFirebaseCallback(this.props.params.userId);
    },

    logout: function (e) {
        e.preventDefault();
        userActions.logout();
        this.transitionTo('home');
    },

    // accumulateItems: function (itemData, component) {

    //     return items;
    // },

    render: function() {
    	var cx = React.addons.classSet;
        var user = this.props.user;
        var postData = this.state.history.posts;
        // var commentData = this.state.history.comments;

        // if state is unresolved, return immediately
        if (!user) {
            return false;
        }

        var comments = {};
        var posts = {};

        // if (!$.isEmptyObject(commentData)) {
        //     var keys = Object.keys(commentData);
        //     keys.forEach(function (commentId) {
        //         var comment = commentData[commentId];
        //         comments[commentId] = <Comment
        //                                 postId={ postId }
        //                                 commentId={ commentId }
        //                                 comment={ comment }
        //                                 user={ user }
        //                                 key={ commentId } />;
        //     });
        // }

        if (!$.isEmptyObject(postData)) {
            var keys = Object.keys(postData);
            keys.forEach(function (postId) {
                var post = postData[postId];
                posts[postId] = <Post post={ post }
                                    user={ user }
                                    postId={ postId }
                                    key={ postId } />;
            });
        }

        var logoutCx = cx({
        	'user-options': true,
        	'float-right': true,
        	'hidden': user.uid !== this.props.params.userId
        });

        return (
            <div className="content inner">
                <div className={ logoutCx }>
                    <button onClick={ this.logout } className="button">Sign Out</button>
                </div>
	            <h1>Profile</h1>
                <div className="user-posts">
                    <h2>Posts</h2>
                    { posts }
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