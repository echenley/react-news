'use strict';

var $ = jQuery;
var React = require('react/addons');
var Reflux = require('reflux');

// stores
var postStore = require('../stores/postStore'),
    userStore = require('../stores/userStore'),
    commentStore = require('../stores/commentStore');

// actions
var commentActions = require('../actions/commentActions');
// var userActions = require('../actions/userActions');

// components
var Post = require('../components/post');
var Comment = require('../components/comment');


var SinglePost = React.createClass({

    mixins: [
        Reflux.listenTo(commentStore, 'onCommentChange'),
        Reflux.connect(userStore, 'user'),
        Reflux.connect(postStore, 'posts')
    ],

    getInitialState: function () {
        return {
            user: false,
            posts: {},
            comments: {}
        };
    },

    componentWillMount: function() {
        // sets callback to watch current post comments
        commentActions.setFirebaseCallback(this.props.params.postId);
    },

    componentWillUnmount: function () {
        commentActions.removeFirebaseCallback(this.props.params.postId);
    },

    onCommentChange: function (comments) {
        this.setState({
            comments: comments
        });
    },

    addComment: function (e) {
        e.preventDefault();
        var commentTextEl = this.refs.commentText.getDOMNode();
        var postId = this.props.params.postId;
        var comment = {
            text: commentTextEl.value.trim(),
            creator: this.state.user.profile.username,
            creatorUID: this.state.user.uid
        };
        commentActions.addComment(postId, comment);
        commentTextEl.value = '';
    },

    render: function() {
        var user = this.state.user;
        var posts = this.state.posts;

        // if state is unresolved, don't render
        if ($.isEmptyObject(posts)) {
            return false;
        }

        var cx = React.addons.classSet;

        var loggedIn = !!user;

        var postId = this.props.params.postId;
        var post = this.state.posts[postId];

        // collect comment components into object
        var commentData = this.state.comments;
        var comments = {};

        if (!$.isEmptyObject(commentData)) {
            var keys = Object.keys(commentData);
            keys.forEach(function (commentId) {
                var comment = commentData[commentId];
                comments[commentId] = <Comment
                                        postId={ postId }
                                        commentId={ commentId }
                                        comment={ comment }
                                        user={ user }
                                        key={ commentId } />;
            });
        }

        var formCx = cx({
            'commentForm': true,
            'hidden': !loggedIn
        });

        return (
            <div className="content inner">
                <Post post={ post }
                    user={ user }
                    postId={ postId }
                    key={ postId } />
                <div className="comments">
                    <h2>Comments</h2>
                    { comments }
                </div>
                <form className={ formCx } onSubmit={ this.addComment }>
                    <textarea placeholder="Post a Comment" ref="commentText" className="comment-input full-width"></textarea>
                    <button type="submit" className="button">Submit</button>
                </form>
            </div>
        );
    }

});

module.exports = SinglePost;