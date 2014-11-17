'use strict';

var $ = jQuery;
var React = require('react/addons');
var Reflux = require('reflux');

// stores
var postStore = require('../stores/postStore'),
    commentStore = require('../stores/commentStore');

// actions
var commentActions = require('../actions/commentActions');
var postActions = require('../actions/postActions');
// var userActions = require('../actions/userActions');

// components
var Post = require('../components/post');
var Comment = require('../components/comment');


var SinglePost = React.createClass({

    mixins: [
        Reflux.listenTo(commentStore, 'onCommentChange'),
        Reflux.listenTo(postStore, 'onPostChange')
    ],

    getInitialState: function () {
        return {
            post: false,
            comments: []
        };
    },

    componentWillMount: function() {
        // sets callback to watch current post comments
        postActions.listenToSingle(this.props.params.postId);
    },

    componentWillUnmount: function () {
        postActions.stopListening(this.props.params.postId);
    },

    onCommentChange: function (comments) {
        this.setState({
            comments: comments
        });
    },

    onPostChange: function (post) {
        this.setState({
            post: post
        });
    },

    addComment: function (e) {
        e.preventDefault();
        var commentTextEl = this.refs.commentText.getDOMNode();
        var comment = {
            postId: this.props.params.postId,
            text: commentTextEl.value.trim(),
            creator: this.props.user.profile.username,
            creatorUID: this.props.user.uid
        };
        commentActions.addComment(comment);
        commentTextEl.value = '';
    },

    render: function() {
        var cx = React.addons.classSet;
        var user = this.props.user;
        var loggedIn = !!user.uid;
        var post = this.state.post;

        // if state is unresolved, don't render
        if (!post) {
            return false;
        }

        // collect comment components into object
        var commentData = this.state.comments;
        var comments = {};

        if (!$.isEmptyObject(commentData)) {
            var keys = Object.keys(commentData);
            keys.forEach(function (commentId) {
                var comment = commentData[commentId];
                comments[commentId] = <Comment
                                        post={post}
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
                <Post post={ post } user={ user } key={ post.id } />
                <div className="comments">
                    <h2>{ comments.length ? comments.length : 'No ' }Comments</h2>
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