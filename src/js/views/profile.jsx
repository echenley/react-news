'use strict';

var Reflux = require('reflux');

// actions
var Actions = require('../actions/Actions');

// stores
var ProfileStore = require('../stores/ProfileStore');
var UserStore = require('../stores/UserStore');

// components
var Spinner = require('../components/Spinner');
var Post = require('../components/Post');
var Comment = require('../components/Comment');

var Profile = React.createClass({

    propTypes: {
        user: React.PropTypes.object,
        params: React.PropTypes.object
    },

    mixins: [
        require('react-router').Navigation,
        Reflux.listenTo(ProfileStore, 'onLoaded')
    ],

    statics: {
        willTransitionTo(transition, params, query, cb) {
            // set callback to watch current user's posts/comments
            UserStore.getUserId(params.username)
                .then(function(userId) {
                    Actions.listenToProfile(userId);
                    return cb();
                });
        },

        willTransitionFrom(transition, component) {
            Actions.stopListeningToProfile();
            component.setState({
                isLoading: true
            });
        }
    },

    getInitialState() {
        return {
            profileData: ProfileStore.getDefaultData(),
            isLoading: true
        };
    },

    onLoaded(profileData) {
        this.setState({
            profileData: profileData,
            isLoading: false
        });
    },

    logout(e) {
        e.preventDefault();
        Actions.logout();
        this.transitionTo('home');
    },

    render() {
        var user = this.props.user;
        var profileData = this.state.profileData;
        var posts = profileData.posts;
        var comments = profileData.comments;

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

module.exports = Profile;
