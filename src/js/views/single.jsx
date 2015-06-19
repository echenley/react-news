'use strict';

var Reflux      = require('reflux');
var singleStore = require('../stores/singleStore');
var actions     = require('../actions/actions');
var Spinner     = require('../components/spinner');
var Post        = require('../components/post');
var Comment     = require('../components/comment');
var Router      = require('react-router');

var SinglePost = React.createClass({

    mixins: [
        require('../mixins/pluralize'),
        Router.Navigation,
        Router.State,
        Reflux.listenTo(singleStore, 'onUpdate')
    ],

    getInitialState: function() {
        return {
            post: false,
            comments: [],
            loading: true
        };
    },

    statics: {

        willTransitionTo: function(transition, params) {
            // watch current post and comments
            actions.listenToPost(params.postId);
        },

        willTransitionFrom: function(transition, component) {
            actions.stopListeningToPost(component.state.post.id);
        }
        
    },

    onUpdate: function(postData) {
        this.setState({
            post: postData.post,
            comments: postData.comments,
            loading: false
        });
    },

    addComment: function(e) {
        e.preventDefault();

        if (!this.props.user.isLoggedIn) {
            actions.showOverlay('login');
            return;
        }

        var commentTextEl = this.refs.commentText.getDOMNode();
        var comment = {
            postId: this.props.params.postId,
            postTitle: this.state.post.title,
            text: commentTextEl.value.trim(),
            creator: this.props.user.profile.username,
            creatorUID: this.props.user.uid,
            time: Date.now()
        };
        actions.addComment(comment);
        commentTextEl.value = '';
    },

    render: function() {
        var user = this.props.user;
        var comments = this.state.comments;
        var post = this.state.post;
        var postId = this.getParams();
        var content;

        if (this.state.loading) {
            content = <Spinner />;
        // } else if (post.isDeleted) {
        //     this.replaceWith('404');
        } else {
            comments = comments.map(function(comment) {
                return <Comment comment={ comment } user={ user } key={ comment.id } />;
            });
            content = (
                <div>
                    <Post post={ post } user={ user } key={ postId } />
                    <div className="comments">
                        <h2>{ this.pluralize(comments.length, 'Comment') }</h2>
                        { comments }
                    </div>
                </div>
            );
        }

        return (
            <div className="content full-width">
                { content }
                <form className='comment-form' onSubmit={ this.addComment }>
                    <textarea placeholder="Post a Comment" ref="commentText" className="comment-input full-width"></textarea>
                    <button type="submit" className="button button-primary">Submit</button>
                </form>
            </div>
        );
    }

});

module.exports = SinglePost;