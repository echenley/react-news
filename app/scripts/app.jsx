'use strict';

var $ = jQuery;
var React = require('react/addons');
var Reflux = require('reflux');

var postActions = require('./actions/postActions');
var postStore = require('./stores/postStore');
var userStore = require('./stores/userStore');

// Routing
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
// var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;

// var TransitionGroup = React.addons.CSSTransitionGroup;

// Views
var Posts = require('./views/posts');
var SinglePost = require('./views/single');
var Register = require('./views/register');
var Login = require('./views/login');
var Profile = require('./views/profile');

var ReactNews = React.createClass({

    mixins: [Reflux.connect(postStore, 'posts'), Reflux.connect(userStore, 'user')],

    getInitialState: function() {
        return {
            posts: {},
            user: false,
            hideMenu: true
        };
    },

    componentDidMount: function () {
        // hide the menu when clicked away
        $(document).on('touchend click', function (e) {
            if (!(this.state.hideMenu || $(e.target).is('.panel, .panel *, .panel-toggle, .panel-icon'))) {
                this.toggleMenu(e);
            }
        }.bind(this));
    },

    toggleMenu: function (e) {
        e.preventDefault();
        this.setState({
            hideMenu: !this.state.hideMenu
        });
    },

    submitPost: function (e) {
        e.preventDefault();
        var user = this.state.user;
        var post = {
            title: this.refs.title.getDOMNode().value.trim(),
            url: this.refs.link.getDOMNode().value.trim(),
            creator: user.profile.username,
            creatorUID: user.uid,
            commentCount: 0
        };
        postActions.submitPost(post);
    },

    render: function() {
        var cx = React.addons.classSet;
        var menuHidden = this.state.hideMenu;
        var user = this.state.user;
        var signedIn = !!user;
        var username = !user ? '' : user.profile.username;
        var md5hash = !user ? '' : user.profile.md5hash;

        var headerCx = cx({
            'menu': true,
            'menu-open': !menuHidden
        });

        var userInfoCx = cx({
            'user-info': true,
            'hidden': !signedIn
        });

        return (
            <div className="wrapper">
                <header className={ headerCx }>
                    <div className="float-left">
                        <Link to="home" className="menu-title">react-news</Link>
                    </div>
                    <div className="float-right">
                        <span className={ signedIn ? 'hidden' : '' }>
                            <Link to="login" className="button">Sign In</Link><Link to="register" className="button">Register</Link>
                        </span>
                        <div className={ userInfoCx }>
                            <Link to="profile" className='profile-link'>
                                { username }
                                <img src={'http://www.gravatar.com/avatar/' + md5hash } className="nav-pic" />
                            </Link>
                        </div>
                        <a href="#" className="panel-toggle" onClick={ this.toggleMenu }>
                            <span className="panel-icon">menu</span>
                        </a>
                    </div>
                </header>
                <div className="panel text-center">
                    <form onSubmit={ this.submitPost } className="panel-form">
                        <input type="text" className="panel-input" placeholder="Title" ref="title" />
                        <input type="text" className="panel-input" placeholder="Link" ref="link" />
                        <button type="submit" className="panel-button">Submit</button>
                    </form>
                </div>
                <this.props.activeRouteHandler />
            </div>
        );
    }
});

var routes = (
    <Routes location="history">
        <Route handler={ ReactNews }>
            <Route name="post" path="/post/:postId" handler={ SinglePost } />
            <Route name="register" path="/register" handler={ Register } />
            <Route name="login" path="/login" handler={ Login } />
            <Route name="profile" handler={Profile} />
            <DefaultRoute name="home" handler={ Posts } />
        </Route>
    </Routes>
);

    // <TransitionGroup transitionName="content" transitionLeave={false} id="content" component="div">

React.render(routes, document.getElementById('app'));

