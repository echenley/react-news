'use strict';

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
var Spinner = require('react-spinner');
var Post = require('../components/post');
var Comment = require('../components/comment');


var SinglePost = React.createClass({

    mixins: [
        Reflux.listenTo(postStore, 'onLoaded'),
        Reflux.connect(commentStore, 'comments')
    ],

    getInitialState: function () {
        return {
            posts: postStore.getDefaultData(),
            comments: commentStore.getDefaultData(),
            isLoading: true
        };
    },

    onLoaded: function (posts) {
        this.setState({
            posts: posts,
            isLoading: false
        });
    },

    componentWillMount: function() {
        // watch current post and comments
        postActions.listenToSingle(this.props.params.postId);
        commentActions.listenToComments(this.props.params.postId);
    },

    componentWillUnmount: function () {
        postActions.stopListening(this.props.params.postId);
        commentActions.stopListening();
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
        var comments = this.state.comments;
        var post = this.state.posts[0];

        if (this.state.isLoading || !post) {
            return (
                <div className="content">
                    <Spinner />
                </div>
            );
        }

        var headerText = function (n) {
            if (n === 0) { return 'No Comments'; }
            if (n === 1) { return '1 Comment'; }
            return n + ' Comments';
        };

        var formCx = cx({
            'comment-form': true,
            'hidden': !loggedIn
        });

        return (
            <div className="content inner">
                <Post post={ post } user={ user } key={ post.id } />
                <div className="comments">
                    <h2>{ headerText(comments.length) }</h2>
                    {
                        comments.map(function (comment) {
                            return <Comment comment={ comment } user={ user } key={ comment.id } />;
                        })
                    }
                </div>
                <form className={ formCx } onSubmit={ this.addComment }>
                    <textarea placeholder="Post a Comment" ref="commentText" className="comment-input full-width"></textarea>
                    <button type="submit" className="button button-primary">Submit</button>
                </form>
            </div>
        );
    }

});

module.exports = SinglePost;