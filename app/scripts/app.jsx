'use strict';

var React = window.react = require('react/addons');
var Reflux = require('reflux');

// Stores
var appStore = require('./stores/appStore');

// Actions
var actions = require('./actions/actions');

// Routing
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;
// var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;

// Views
var Posts = require('./views/posts');
var SinglePost = require('./views/single');
var Profile = require('./views/profile');

// Components
var Login = require('./components/login');
var Register = require('./components/register');

var ReactNews = React.createClass({

    mixins: [
        Reflux.listenTo(appStore, 'onStoreUpdate'),
        Reflux.listenTo(actions.showLoginOverlay, 'showLoginOverlay'),
        Reflux.listenTo(actions.showRegisterOverlay, 'showRegisterOverlay')
    ],

    getInitialState: function () {
        var defaultData = appStore.getDefaultData();
        return {
            user: defaultData.user,
            panelHidden: true,
            showOverlay: false,
            overlayType: 'Login'
        };
    },

    onStoreUpdate: function (appData) {
        this.setState({
            user: appData.user,
            sortBy: appData.sortBy,
            showOverlay: false
        });
    },

    isChildNodeOf: function (target, excludedIds) {
        // returns boolean whether target is child of a list of ids
        // excludedIds can be a string or an array
        if (typeof excludedIds === 'string') {
            excludedIds = [excludedIds];
        }
        // if this node is not the one we want, move up the dom tree
        while (target !== null && excludedIds.indexOf(target.id) < 0) {
            target = target.parentNode;
        }
        // at this point we have found our containing div or we are out of parent nodes
        return (target !== null && excludedIds.indexOf(target.id) >= 0);
    },

    componentDidMount: function () {
        // hide the menu when clicked away
        jQuery(document).on('click', function (e) {
            if (!this.state.panelHidden && !this.isChildNodeOf(e.target, ['header-panel','panel-toggle'])) {
                this.togglePanel();
            }
        }.bind(this));

        jQuery(document).keyup(function(e) {
            if (e.keyCode === 27) { // esc
                this.hideOverlay();
            }
        }.bind(this));
    },

    togglePanel: function () {
        this.setState({
            panelHidden: !this.state.panelHidden
        });
    },

    hideOverlayListener: function (e) {
        if (!this.isChildNodeOf(e.target, ['overlay-content'])) {
            this.hideOverlay();
        }
    },

    hideOverlay: function () {
        this.setState({
            showOverlay: false
        });
    },

    showOverlay: function () {
        var overlay = this.refs.overlay.getDOMNode();
        overlay.addEventListener('click', this.hideOverlayListener);
        this.setState({
            showOverlay: true
        });
    },

    showLoginOverlay: function () {
        this.setState({
            overlayType: 'Login'
        });
        this.showOverlay();
    },

    showRegisterOverlay: function () {
        this.setState({
            overlayType: 'Register'
        });
        this.showOverlay();
    },

    submitPost: function (e) {
        e.preventDefault();

        var titleEl = this.refs.title.getDOMNode();
        var linkEl = this.refs.link.getDOMNode();

        var user = this.state.user;

        if (!user.isLoggedIn) {
            actions.showLoginOverlay();
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

    render: function () {
        var cx = React.addons.classSet;
        var menuHidden = this.state.panelHidden;
        var user = this.state.user;
        var postError = this.state.postError;

        var username = user ? user.profile.username : '';
        var md5hash = user ? user.profile.md5hash : '';
        var gravatarURI = 'http://www.gravatar.com/avatar/' + md5hash + '?d=mm';

        var headerCx = cx({
            'header': true,
            'panel-open': !menuHidden
        });

        var userInfoCx = cx({
            'user-info': true,
            'hidden': !user.isLoggedIn
        });

        var titleInputCx = cx({
            'panel-input': true,
            'input-error': postError === 'title_error'
        });

        var linkInputCx = cx({
            'panel-input': true,
            'input-error': postError === 'link_error'
        });

        var overlayCx = cx({
            'md-overlay': true,
            'md-show': this.state.showOverlay
        });

        var overlayContent = <Login />;
        if (this.state.overlayType === 'Register') {
            overlayContent = <Register />;
        }

        return (
            <div className="wrapper">
                <header className={ headerCx }>
                    <div className="header-main">
                        <div className="float-left">
                            <Link to="home" className="menu-title">react-news</Link>
                        </div>
                        <div className="float-right">
                            <span className={ user.isLoggedIn ? 'hidden' : '' }>
                                <a onClick={ actions.showLoginOverlay }>Sign In</a>
                                <a onClick={ actions.showRegisterOverlay } className="register-link">Register</a>
                            </span>
                            <span className={ userInfoCx }>
                                <Link to="profile" params={{ username: username }} className="profile-link">
                                    { username }
                                    <img src={ gravatarURI } className="nav-pic" />
                                </Link>
                            </span>
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
                <main id="content">
                    <RouteHandler { ...this.props } user={ this.state.user } />
                </main>
                <div className={ overlayCx } ref="overlay">{ overlayContent }</div>
            </div>
        );
    }
});

var routes = (
    <Route handler={ ReactNews }>
        <Route name="post" path="/post/:postId" handler={ SinglePost } />
        <Route name="profile" path="/:username" handler={ Profile } />
        <DefaultRoute name="home" handler={ Posts } />
    </Route>
);


Router.run(routes, function (Handler, state) {
    React.render(<Handler params={ state.params } />, document.getElementById('app'));
});



