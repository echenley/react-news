'use strict';

import React from 'react/addons';
import Reflux from 'reflux';
import { Navigation, TransitionHook } from 'react-router';

import SingleStore from '../stores/SingleStore';
import UserStore from '../stores/UserStore';
import Actions from '../actions/Actions';
import Spinner from '../components/Spinner';
import Post from '../components/Post';
import Comment from '../components/Comment';

import pluralize from '../util/pluralize';

const SinglePost = React.createClass({

    propTypes: {
        user: React.PropTypes.object,
        params: React.PropTypes.object
    },

    mixins: [
        Navigation,
        TransitionHook,
        Reflux.listenTo(SingleStore, 'onUpdate'),
        Reflux.connect(UserStore, 'user')
    ],

    getInitialState() {
        return {
            user: UserStore.getDefaultData(),
            post: false,
            comments: [],
            loading: true
        };
    },

    componentDidMount() {
        let postId = this.props.params.postId;
        Actions.watchPost(postId);
    },

    componentWillReceiveProps(nextProps) {
        let oldPostId = this.props.params.postId;
        let newPostId = nextProps.params.postId;

        if (newPostId !== oldPostId) {
            this.setState({
                loading: true
            });

            Actions.stopWatchingPost(oldPostId);
            Actions.watchPost(newPostId);
        }
    },

    routerWillLeave() {
        let postId = this.props.params.postId;
        Actions.stopWatchingPost(postId);
    },

    onUpdate(postData) {
        if (!postData.post) {
            // post doesn't exist
            this.transitionTo('/404');
            return;
        }

        this.setState({
            post: postData.post,
            comments: postData.comments,
            loading: false
        });
    },

    addComment(e) {
        e.preventDefault();
        let user = this.state.user;

        if (!user.isLoggedIn) {
            Actions.showModal('login', 'LOGIN_REQUIRED');
            return;
        }

        let commentTextEl = React.findDOMNode(this.refs.commentText);
        let comment = {
            postId: this.props.params.postId,
            postTitle: this.state.post.title,
            text: commentTextEl.value.trim(),
            creator: user.profile.username,
            creatorUID: user.uid,
            time: Date.now()
        };

        Actions.addComment(comment);
        commentTextEl.value = '';
    },

    render() {
        let user = this.state.user;
        let post = this.state.post;
        let postId = this.props.params.postId;
        let content;

        if (this.state.loading) {
            content = <Spinner />;
        } else {
            let comments = this.state.comments.map(comment => (
                <Comment comment={ comment } user={ user } key={ comment.id } />
            ));

            content = (
                <div>
                    <Post post={ post } user={ user } key={ postId } />
                    <div className="comments">
                        <h2>{ pluralize(comments.length, 'Comment') }</h2>
                        { comments }
                    </div>
                </div>
            );
        }

        return (
            <div className="content full-width">
                { content }
                <form className='comment-form' onSubmit={ this.addComment }>
                    <textarea
                        placeholder="Post a Comment"
                        ref="commentText"
                        className="comment-input full-width"
                    ></textarea>
                    <button type="submit" className="button button-primary">Submit</button>
                </form>
            </div>
        );
    }

});

export default SinglePost;
