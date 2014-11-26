'use strict';

var React = require('react/addons');
var Reflux = require('reflux');

// stores
// var postStore = require('../stores/postStore');
// var commentStore = require('../stores/commentStore');
var singleStore = require('../stores/singleStore');

// actions
var actions = require('../actions/actions');

// components
var Spinner = require('react-spinner');
var Post = require('../components/post');
var Comment = require('../components/comment');


var SinglePost = React.createClass({

    mixins: [
        require('../mixins/pluralize'),
        Reflux.listenTo(singleStore, 'onUpdate')
    ],

    getInitialState: function () {
        return {
            post: false,
            comments: [],
            isLoading: true
        };
    },

    onUpdate: function (postData) {
        this.setState({
            post: postData.post,
            comments: postData.comments
        });
    },

    componentWillMount: function () {
        // watch current post and comments
        actions.listenToPost(this.props.params.postId);
    },

    componentWillUnmount: function () {
        actions.stopListeningToPost(this.props.params.postId);
    },

    addComment: function (e) {
        e.preventDefault();

        if (!this.props.user.isLoggedIn) {
            actions.showLoginOverlay();
            return;
        }

        var commentTextEl = this.refs.commentText.getDOMNode();
        var comment = {
            postId: this.props.params.postId,
            postTitle: this.state.post.title,
            text: commentTextEl.value.trim(),
            creator: this.props.user.profile.username,
            creatorUID: this.props.user.uid
        };
        actions.addComment(comment);
        commentTextEl.value = '';
    },

    render: function () {
        var user = this.props.user;
        var comments = this.state.comments;
        var post = this.state.post;

        if (!post) {
            return (
                <div className="content">
                    <Spinner />
                </div>
            );
        }

        return (
            <div className="content inner fade-in">
                <Post post={ post } user={ user } key={ post.id } />
                <div className="comments">
                    <h2>{ this.pluralize(comments.length, 'Comment') }</h2>
                    {
                        comments.map(function (comment) {
                            return <Comment comment={ comment } user={ user } key={ comment.id } />;
                        })
                    }
                </div>
                <form className='comment-form' onSubmit={ this.addComment }>
                    <textarea placeholder="Post a Comment" ref="commentText" className="comment-input full-width"></textarea>
                    <button type="submit" className="button button-primary">Submit</button>
                </form>
            </div>
        );
    }

});

module.exports = SinglePost;