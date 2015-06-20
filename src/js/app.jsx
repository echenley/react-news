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

var userStore = require('./stores/userStore');
var actions = require('./actions/actions');
var Posts = require('./views/posts');
var SinglePost = require('./views/single');
var Profile = require('./views/profile');
var UhOh = require('./views/404');
var Login = require('./components/login');
var Register = require('./components/register');

var cx = require('classnames');

var ReactNews = React.createClass({

    mixins: [
        require('react-router').Navigation,
        Reflux.listenTo(userStore, 'onStoreUpdate'),
        Reflux.listenTo(actions.showOverlay, 'showOverlay'),
        Reflux.listenTo(actions.goToPost, 'goToPost')
    ],

    getInitialState() {
        return {
            user: userStore.getDefaultData(),
            showPanel: false,
            showOverlay: false,
            overlayType: 'login'
        };
    },

    componentDidMount() {
        document.addEventListener('keyup', e => {
            if (e.keyCode === 27) { // esc
                e.preventDefault();
                this.hideOverlay();
            }
        });
    },

    goToPost(postId) {
        this.transitionTo('post', { postId: postId });
    },

    onStoreUpdate(user) {
        this.setState({
            user: user,
            showOverlay: false
        });
    },

    togglePanel() {
        this.setState({
            showPanel: !this.state.showPanel
        });
    },

    hideOverlay() {
        this.setState({
            showOverlay: false
        });
    },

    showOverlay(type) {
        this.setState({
            overlayType: type,
            showOverlay: true
        });
    },

    submitPost(e) {
        e.preventDefault();

        var titleEl = this.refs.title.getDOMNode();
        var linkEl = this.refs.link.getDOMNode();

        var user = this.state.user;

        if (!user.isLoggedIn) {
            actions.showOverlay('login');
            return;
        }

        if (titleEl.value.trim() === '') {
            this.setState({
                'postError': 'title_error'
            });
            return;
        }

        if (linkEl.value.trim() === '') {
            this.setState({
                'postError': 'link_error'
            });
            return;
        }

        var post = {
            title: titleEl.value.trim(),
            url: linkEl.value.trim(),
            creator: user.profile.username,
            creatorUID: user.uid,
            time: Date.now()
        };

        actions.submitPost(post);

        titleEl.value = '';
        linkEl.value = '';

        this.togglePanel();
    },

    render() {
        var user = this.state.user;
        var postError = this.state.postError;

        var username = user ? user.profile.username : '';
        var md5hash = user ? user.profile.md5hash : '';
        var gravatarURI = 'http://www.gravatar.com/avatar/' + md5hash + '?d=mm';

        var headerCx = cx(
            'header', {
            'panel-open': this.state.showPanel
        });

        var titleInputCx = cx(
            'panel-input', {
            'input-error': postError === 'title_error'
        });

        var linkInputCx = cx(
            'panel-input', {
            'input-error': postError === 'link_error'
        });

        var wrapperCx = cx(
            'wrapper',
            'full-height', {
            'modal-open': this.state.showOverlay
        });

        var overlayContent = this.state.overlayType === 'register'
            ? <Register />
            : <Login />;

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
                <a onClick={ actions.showOverlay.bind(this, 'login') }>Sign In</a>
                <a onClick={ actions.showOverlay.bind(this, 'register') } className="register-link">Register</a>
            </span>
        );

        return (
            <div className={ wrapperCx }>
                <header className={ headerCx }>
                    <div className="header-main">
                        <div className="float-left">
                            <Link to="home" className="menu-title">react-news</Link>
                        </div>
                        <div className="float-right">
                            { userArea }
                            <a id="panel-toggle" className="panel-toggle" onClick={ this.togglePanel }>
                                <span className="sr-only">Add Post</span>
                            </a>
                        </div>
                    </div>
                    <div id="header-panel" className="header-panel text-center">
                        <form onSubmit={ this.submitPost } className="panel-form">
                            <input type="text" className={ titleInputCx } placeholder="Title" ref="title" />
                            <input type="url" className={ linkInputCx } placeholder="Link" ref="link" />
                            <button type="submit" className="button panel-button button-outline">Submit</button>
                        </form>
                    </div>
                </header>

                <main id="content" className="full-height inner">
                    <RouteHandler { ...this.props } user={ this.state.user } />
                </main>

                { overlayContent }
                <a href="#" className='md-overlay' onClick={ this.hideOverlay }></a>
            </div>
        );
    }
});

var routes = (
    <Route handler={ ReactNews }>
        <Route name="post" path="/post/:postId" handler={ SinglePost } />
        <Route name="profile" path="user/:username" handler={ Profile } />
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
