/*
Project:    react-news
Author:     Evan Henley
Author URI: http://henleyedition.com/
====================================== */

'use strict';

window.React = require('react/addons');
var Reflux = require('reflux');

var attachFastClick = require('fastclick');

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;
// var  = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;

var UserStore = require('./stores/UserStore');
var Actions = require('./actions/Actions');
var Posts = require('./views/Posts');
var SinglePost = require('./views/Single');
var Profile = require('./views/Profile');
var UhOh = require('./views/404');
var Login = require('./components/Login');
var Register = require('./components/Register');
var NewPost = require('./components/NewPost');

var cx = require('classnames');

function keyUpHandler(e) {
    // esc key closes modal
    if (e.keyCode === 27) {
        e.preventDefault();
        Actions.hideModal();
    }
}

var App = React.createClass({

    mixins: [
        require('react-router').Navigation,
        Reflux.listenTo(UserStore, 'onStoreUpdate'),
        Reflux.listenTo(Actions.showModal, 'showModal'),
        Reflux.listenTo(Actions.hideModal, 'hideModal'),
        Reflux.listenTo(Actions.goToPost, 'goToPost')
    ],

    getInitialState() {
        return {
            user: UserStore.getDefaultData(),
            showModal: false,
            modalType: 'login'
        };
    },

    goToPost(postId) {
        this.transitionTo('post', { postId: postId });
    },

    onStoreUpdate(user) {
        this.setState({
            user: user,
            showModal: false
        });
    },

    hideModal(e) {
        e.preventDefault();

        window.removeEventListener('keyup', keyUpHandler);

        this.setState({
            showModal: false
        });
    },

    newPost() {
        Actions.showModal(this.state.user ? 'newpost' : 'login');
    },

    showModal(type) {
        // pressing esc closes modal
        window.addEventListener('keyup', keyUpHandler);

        this.setState({
            modalType: type,
            showModal: true
        });
    },

    render() {
        var user = this.state.user;

        var username = user ? user.profile.username : '';
        var md5hash = user ? user.profile.md5hash : '';
        var gravatarURI = 'http://www.gravatar.com/avatar/' + md5hash + '?d=mm';

        var wrapperCx = cx(
            'wrapper',
            'full-height', {
            'modal-open': this.state.showModal
        });

        var modalTypes = {
            'register': <Register />,
            'login': <Login />,
            'newpost': <NewPost />
        };

        var modalType = modalTypes[this.state.modalType];

        var userArea = user.isLoggedIn ? (
            // show profile info
            <span className="user-info">
                <Link to="profile" params={{ username: username }} className="profile-link">
                    <span className="username">{ username }</span>
                    <img src={ gravatarURI } className="nav-pic" />
                </Link>
            </span>
        ) : (
            // show login/register
            <span>
                <a onClick={ Actions.showModal.bind(this, 'login') }>Sign In</a>
                <a onClick={ Actions.showModal.bind(this, 'register') } className="register-link">Register</a>
            </span>
        );

        return (
            <div className={ wrapperCx }>
                <header className="header cf">
                    <div className="float-left">
                        <Link to="home" className="menu-title">react-news</Link>
                    </div>
                    <div className="float-right">
                        { userArea }
                        <a className="newpost-toggle" onClick={ this.newPost }>
                            <i className="fa fa-plus-square-o"></i>
                            <span className="sr-only">New Post</span>
                        </a>
                    </div>
                </header>

                <main id="content" className="full-height inner">
                    <RouteHandler { ...this.props } user={ this.state.user } />
                </main>

                <aside className="md-modal">
                    { modalType }
                </aside>
                <a href="#" className="md-mask" onClick={ this.hideModal }></a>
            </div>
        );
    }
});

var routes = (
    <Route handler={ App }>
        <Route name="post" path="/post/:postId" handler={ SinglePost } />
        <Route name="profile" path="/user/:username" handler={ Profile } />
        <Route name="posts" path="/posts/:pageNum" handler={ Posts } ignoreScrollBehavior />
        <Route name="404" path="/404" handler={ UhOh } />
        <DefaultRoute name="home" handler={ Posts } />
    </Route>
);


Router.run(routes, function(Handler, state) {
    React.render(<Handler params={ state.params } />, document.getElementById('app'));
});

// fastclick eliminates 300ms click delay on mobile
attachFastClick(document.body);
