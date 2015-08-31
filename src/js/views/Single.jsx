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
import CommentForm from '../components/CommentForm';

import pluralize from '../util/pluralize';

const SinglePost = React.createClass({

    propTypes: {
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
            post: null,
            comments: [],
            loading: true
        };
    },

    componentDidMount() {
        let { postId } = this.props.params;
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
        let { postId } = this.props.params;
        Actions.stopWatchingPost(postId);
    },

    onUpdate(postData) {
        let {
            post,
            comments
        } = postData;

        if (!post) {
            // post doesn't exist
            this.transitionTo('/404');
            return;
        }

        this.setState({
            post: post,
            comments: comments,
            loading: false
        });
    },

    render() {
        let {
            loading,
            user,
            post,
            comments,
            commentErrorMessage
        } = this.state;

        let { postId } = this.props.params;
        let content;

        if (loading) {
            content = <Spinner />;
        } else {
            let commentComponents = comments.map(comment => (
                <Comment comment={ comment } user={ user } key={ comment.id } />
            ));

            content = (
                <div>
                    <Post post={ post } user={ user } key={ postId } />
                    <div className="comments">
                        <h2>{ pluralize(comments.length, 'Comment') }</h2>
                        { commentComponents }
                    </div>
                </div>
            );
        }

        return (
            <div className="content full-width">
                { content }
                <CommentForm
                    user={ user }
                    post={ post || {} }
                />
            </div>
        );
    }
});

export default SinglePost;
