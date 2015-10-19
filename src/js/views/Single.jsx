'use strict';

import React, { PropTypes } from 'react';
import Reflux from 'reflux';
import { History } from 'react-router';

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
        params: PropTypes.object
    },

    mixins: [
        History,
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
        const { postId } = this.props.params;
        Actions.watchPost(postId);
    },

    componentWillReceiveProps(nextProps) {
        const oldPostId = this.props.params.postId;
        const newPostId = nextProps.params.postId;

        if (newPostId !== oldPostId) {
            this.setState({
                loading: true
            });

            Actions.stopWatchingPost(oldPostId);
            Actions.watchPost(newPostId);
        }
    },

    componentWillUnmount() {
        const { postId } = this.props.params;
        Actions.stopWatchingPost(postId);
    },

    onUpdate(postData) {
        const { post, comments } = postData;

        if (!post) {
            // post doesn't exist
            this.history.pushState(null, '/404');
            return;
        }

        this.setState({
            post: post,
            comments: comments,
            loading: false
        });
    },

    render() {
        const { loading, user, post, comments } = this.state;
        const { postId } = this.props.params;

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
