'use strict';

var React = window.react = require('react/addons');
var Reflux = require('reflux');

// stores
var userStore = require('./stores/userStore');
// var appStore = require('./stores/appStore');

// actions
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
var Register = require('./views/register');
var Login = require('./views/login');
var Profile = require('./views/profile');

var ReactNews = React.createClass({

    mixins: [
        Reflux.connect(userStore, 'user')
    ],

    getInitialState: function () {
        return {
            user: userStore.getDefaultData(),
            panelHidden: true
        };
    },

    // onUIError: function (error) {
    //     window.alert(error);
    // },

    componentDidMount: function () {
        // hide the menu when clicked away
        jQuery(document).on('touchend click', function (e) {
            if (!this.state.panelHidden) {
                var d = e.target;
                var excludedIds = ['header-panel','panel-toggle'];

                // if this node is not the one we want, move up the dom tree
                while (d !== null && excludedIds.indexOf(d.id) < 0) {
                    d = d.parentNode;
                }

                // at this point we have found our containing div or we are out of parent nodes
                var insideMyDiv = (d !== null && excludedIds.indexOf(d.id) >= 0);

                if (!insideMyDiv) {
                    this.togglePanel();
                }
            }
        }.bind(this));
    },

    togglePanel: function () {
        this.setState({
            panelHidden: !this.state.panelHidden
        });
    },

    submitPost: function (e) {
        e.preventDefault();

        var titleEl = this.refs.title.getDOMNode();
        var linkEl = this.refs.link.getDOMNode();

        var user = this.state.user;

        if (!user.isLoggedIn) {
            actions.loginRequired();
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
            creatorUID: user.uid
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
        var gravatarURI = 'http://www.gravatar.com/avatar/' + md5hash;

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

        return (
            <div className="wrapper">
                <header className={ headerCx }>
                    <div className="header-main">
                        <div className="float-left">
                            <Link to="home" className="button menu-title">react-news</Link>
                        </div>
                        <div className="float-right">
                            <span className={ user.isLoggedIn ? 'hidden' : '' }>
                                <Link to="login">Sign In</Link>
                                <Link to="register" className="register-link">Register</Link>
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
            </div>
        );
    }
});

var routes = (
    <Route handler={ ReactNews }>
        <Route name="post" path="/post/:postId" handler={ SinglePost } />
        <Route name="register" path="/register" handler={ Register } />
        <Route name="login" path="/login" handler={ Login } />
        <Route name="profile" path="/:username" handler={ Profile } />
        <DefaultRoute name="home" handler={ Posts } />
    </Route>
);


Router.run(routes, function (Handler, state) {
    React.render(<Handler params={ state.params } />, document.getElementById('app'));
});



