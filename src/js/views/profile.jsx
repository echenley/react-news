'use strict';

import React from 'react/addons';
import Reflux from 'reflux';

// actions
import Actions from '../actions/Actions';

// stores
import ProfileStore from '../stores/ProfileStore';
import UserStore from '../stores/UserStore';

// components
import Spinner from '../components/Spinner';
import Post from '../components/Post';
import Comment from '../components/Comment';

const Profile = React.createClass({

    propTypes: {
        params: React.PropTypes.object
    },

    mixins: [
        require('react-router').Navigation,
        Reflux.listenTo(ProfileStore, 'updateProfileData'),
        Reflux.listenTo(UserStore, 'updateUser')
    ],

    getInitialState() {
        return {
            user: UserStore.getDefaultData(),
            profileData: ProfileStore.getDefaultData(),
            isLoading: true
        };
    },

    componentDidMount() {
        // watch current user's posts/comments
        let username = this.props.params.username;

        UserStore.getUserId(username)
            .then(Actions.watchProfile);
    },

    routerWillLeave() {
        Actions.stopWatchingProfile();
    },

    updateUser(updatedUser) {
        if (updatedUser.isLoggedin) {
            this.setState({
                user: updatedUser
            });
        } else {
            // user has logged out
            this.transitionTo('home');
        }
    },

    updateProfileData(profileData) {
        this.setState({
            profileData: profileData,
            isLoading: false
        });
    },

    logout(e) {
        e.preventDefault();
        Actions.logout();
    },

    render() {
        var user = this.state.user;
        var profileData = this.state.profileData;
        var posts = profileData.posts;
        var comments = profileData.comments;

        console.log(user);

        var postList, commentList, postHeader, commentsHeader;

        if (this.state.isLoading) {
            postHeader = <h2>Loading Posts...</h2>;
            postList = <Spinner />;
            commentsHeader = <h2>Loading Comments...</h2>;
            commentList = <Spinner />;
        } else {
            postHeader = <h2>{ posts.length ? 'Latest' : 'No'} Posts</h2>;
            commentsHeader = <h2>{ comments.length ? 'Latest' : 'No'} Comments</h2>;

            postList = posts.map((post) => (
                <Post
                    post={ post }
                    user={ user }
                    key={ post.id }
                />
            ));

            commentList = comments.map((comment) => (
                <Comment
                    showPostTitle={ true }
                    comment={ comment }
                    user={ user }
                    key={ comment.id }
                />
            ));
        }

        return (
            <div className="content full-width">
                {
                    user.uid === profileData.userId && (
                        <div className="user-options text-right">
                            <button
                                onClick={ this.logout }
                                className="button button-primary"
                            >
                                Sign Out
                            </button>
                        </div>
                    )
                }
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
