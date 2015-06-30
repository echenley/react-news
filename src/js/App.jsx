/*
Project:    react-news
Author:     Evan Henley
Author URI: http://henleyedition.com/
====================================== */

'use strict';

import React from 'react/addons';
import Reflux from 'reflux';

import { Router, Route, Redirect } from 'react-router';
import HashHistory from 'react-router/lib/HashHistory';
import Link from 'react-router/lib/Link';

import Actions from './actions/Actions';

import UserStore from './stores/UserStore';
import ModalStore from './stores/ModalStore';

import Posts from './views/Posts';
import SinglePost from './views/Single';
import Profile from './views/Profile';
import UhOh from './views/404';
import Login from './components/Login';
import Register from './components/Register';
import NewPost from './components/NewPost';

import cx from 'classnames';

let App = React.createClass({

    propTypes: {
        children: React.PropTypes.object
    },

    mixins: [
        Reflux.listenTo(UserStore, 'onStoreUpdate'),
        Reflux.listenTo(ModalStore, 'onModalUpdate')
    ],

    getInitialState() {
        return {
            user: UserStore.getDefaultData(),
            modal: ModalStore.getDefaultData()
        };
    },

    onStoreUpdate(user) {
        this.setState({
            user: user,
            showModal: false
        });
    },

    onModalUpdate(newModalState) {
        let oldModalState = this.state.modal;

        function onKeyUp(e) {
            // esc key closes modal
            if (e.keyCode === 27) {
                Actions.hideModal();
            }
        }

        // pressing esc closes modal
        if (!oldModalState.show && newModalState.show) {
            window.addEventListener('keyup', onKeyUp);
        } else if (oldModalState.show && !newModalState.show) {
            window.removeEventListener('keyup', onKeyUp);
        }

        this.setState({
            modal: newModalState
        });
    },

    hideModal(e) {
        e.preventDefault();
        Actions.hideModal();
    },

    newPost() {
        if (this.state.user.isLoggedIn) {
            Actions.showModal('newpost');
        } else {
            Actions.showModal('login', 'LOGIN_REQUIRED');
        }
    },

    render() {
        let user = this.state.user;
        let modal = this.state.modal;

        let username = user ? user.profile.username : '';
        let md5hash = user ? user.profile.md5hash : '';
        let gravatarURI = 'http://www.gravatar.com/avatar/' + md5hash + '?d=mm';

        let wrapperCx = cx(
            'wrapper',
            'full-height', {
            'modal-open': modal.show
        });

        let modalTypes = {
            'register': <Register errorMessage={ modal.errorMessage } />,
            'login': <Login errorMessage={ modal.errorMessage } />,
            'newpost': <NewPost errorMessage={ modal.errorMessage } user={ user } />
        };

        let userArea = user.isLoggedIn ? (
            // show profile info
            <span className="user-info">
                <Link to={ `/user/${username}` } className="profile-link">
                    <span className="username">{ username }</span>
                    <img src={ gravatarURI } className="profile-pic" />
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
                    { modalTypes[modal.type] }
                </aside>
                <a href="#" className="md-mask" onClick={ this.hideModal }></a>
            </div>
        );
    }
});

React.render((
    <Router history={ new HashHistory() }>
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
