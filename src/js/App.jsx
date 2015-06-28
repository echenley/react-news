/*
Project:    react-news
Author:     Evan Henley
Author URI: http://henleyedition.com/
====================================== */

'use strict';

import React from 'react/addons';
import Reflux from 'reflux';

import { Router, Route, Redirect } from 'react-router';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import Link from 'react-router/lib/Link';

import UserStore from './stores/UserStore';
import Actions from './actions/Actions';
import Posts from './views/Posts';
import SinglePost from './views/Single';
import Profile from './views/Profile';
import UhOh from './views/404';
import Login from './components/Login';
import Register from './components/Register';
import NewPost from './components/NewPost';

import cx from 'classnames';

function keyUpHandler(e) {
    // esc key closes modal
    if (e.keyCode === 27) {
        Actions.hideModal(e);
    }
}

let App = React.createClass({

    propTypes: {
        children: React.PropTypes.object
    },

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
        if (e) { e.preventDefault(); }

        window.removeEventListener('keyup', keyUpHandler);

        this.setState({
            showModal: false
        });
    },

    newPost() {
        if (!this.state.user.isLoggedIn) {
            Actions.showModal('login', 'LOGIN_REQUIRED');
            return;
        } else {
            Actions.showModal('newpost');
        }
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
        let user = this.state.user;

        let username = user ? user.profile.username : '';
        let md5hash = user ? user.profile.md5hash : '';
        let gravatarURI = 'http://www.gravatar.com/avatar/' + md5hash + '?d=mm';

        let wrapperCx = cx(
            'wrapper',
            'full-height', {
            'modal-open': this.state.showModal
        });

        let modalTypes = {
            'register': <Register />,
            'login': <Login />,
            'newpost': <NewPost user={ user } />
        };

        let modalType = modalTypes[this.state.modalType];

        let userArea = user.isLoggedIn ? (
            // show profile info
            <span className="user-info">
                <Link to={ `/user/${username}` } className="profile-link">
                    <span className="username">{ username }</span>
                    <img src={ gravatarURI } className="nav-pic" />
                </Link>
            </span>
        ) : (
            // show login/register
            <span>
                <a onClick={ () => Actions.showModal('login') }>Sign In</a>
                <a onClick={ () => Actions.showModal('register') } className="register-link">Register</a>
            </span>
        );

        return (
            <div className={ wrapperCx }>
                <header className="header cf">
                    <div className="float-left">
                        <Link to="/" className="menu-title">react-news</Link>
                    </div>
                    <div className="float-right">
                        { userArea }
                        <a className="newpost-link" onClick={ this.newPost }>
                            <i className="fa fa-plus-square-o"></i>
                            <span className="sr-only">New Post</span>
                        </a>
                    </div>
                </header>

                <main id="content" className="full-height inner">
                    { this.props.children || <Posts /> }
                </main>

                <aside className="md-modal">
                    <a href="#" onClick={ this.hideModal } className="md-close">
                        <span className="fa fa-close"></span>
                        <span className="sr-only">Hide Modal</span>
                    </a>
                    { modalType }
                </aside>
                <a href="#" className="md-mask" onClick={ this.hideModal }></a>
            </div>
        );
    }
});

React.render((
    <Router history={ new BrowserHistory() }>
        <Route component={ App }>
            <Route name="home" path="/" component={ Posts } />
            <Route name="posts" path="/posts/:pageNum" component={ Posts } />
            <Route name="post" path="/post/:postId" component={ SinglePost } />
            <Route name="profile" path="/user/:username" component={ Profile } />
            <Route name="404" path="/404" component={ UhOh } />
            {/* Redirects */}
            <Redirect from="/posts" to="/" />
            <Redirect from="*" to="/404" />
        </Route>
    </Router>
), document.getElementById('app'));
