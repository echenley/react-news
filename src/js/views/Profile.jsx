'use strict';

import React, { PropTypes } from 'react';
import Reflux from 'reflux';
import { History } from 'react-router';

import Actions from '../actions/Actions';

import ProfileStore from '../stores/ProfileStore';
import UserStore from '../stores/UserStore';

import Spinner from '../components/Spinner';
import Post from '../components/Post';
import Comment from '../components/Comment';

const Profile = React.createClass({

    propTypes: {
        params: PropTypes.object
    },

    mixins: [
        History,
        Reflux.listenTo(ProfileStore, 'updateProfileData'),
        Reflux.listenTo(UserStore, 'updateUser')
    ],

    getInitialState() {
        return {
            user: UserStore.getDefaultData(),
            profileData: ProfileStore.getDefaultData(),
            loading: true
        };
    },

    componentDidMount() {
        let username = this.props.params.username;

        // watch posts/comments for username in url
        UserStore.getUserId(username)
            .then(Actions.watchProfile);
    },

    componentWillReceiveProps(nextProps) {
        let oldUsername = this.props.params.username;
        let newUsername = nextProps.params.username;

        if (oldUsername !== newUsername) {
            this.setState({
                loading: true
            });

            Actions.stopWatchingProfile();
            UserStore.getUserId(newUsername)
                .then(Actions.watchProfile);
        }
    },

    componentWillUnmount() {
        Actions.stopWatchingProfile();
    },

    updateUser(updatedUser) {
        if (updatedUser.isLoggedIn) {
            this.setState({
                user: updatedUser
            });
        } else {
            // user has logged out
            this.history.pushState(null, '/');
        }
    },

    updateProfileData(profileData) {
        this.setState({
            profileData: profileData,
            loading: false
        });
    },

    logout(e) {
        e.preventDefault();
        Actions.logout();
    },

    render() {
        let { user, profileData, loading } = this.state;
        let posts = profileData.posts;
        let comments = profileData.comments;

        let postList, commentList, postHeader, commentsHeader;

        if (loading) {
            postHeader = <h2>Loading Posts...</h2>;
            postList = <Spinner />;
            commentsHeader = <h2>Loading Comments...</h2>;
            commentList = <Spinner />;
        } else {
            postHeader = <h2>{ posts.length ? 'Latest' : 'No'} Posts</h2>;
            commentsHeader = <h2>{ comments.length ? 'Latest' : 'No'} Comments</h2>;

            postList = posts.map(post => (
                <Post
                    post={ post }
                    user={ user }
                    key={ post.id }
                />
            ));

            commentList = comments.map(comment => (
                <Comment
                    showPostTitle
                    comment={ comment }
                    user={ user }
                    key={ comment.id }
                />
            ));
        }

        let userOptions = user.uid === profileData.userId && (
            <div className="user-options text-right">
                <button
                    onClick={ this.logout }
                    className="button button-primary"
                >
                    Sign Out
                </button>
                <hr />
            </div>
        );

        return (
            <div className="content full-width">
                { userOptions }
                <h1>{ this.props.params.username + '\'s' } Profile</h1>
                <div className="user-posts">
                    { postHeader }
                    { postList }
                </div>
                <div className="user-comments">
                    { commentsHeader }
                    { commentList }
                </div>
            </div>
        );
    }

});

export default Profile;
