/*
Project:    react-news
Author:     Evan Henley
Author URI: http://henleyedition.com/
====================================== */

'use strict';

import React from 'react/addons';
import Reflux from 'reflux';
import { Link } from 'react-router';

import Actions from './actions/Actions';

import UserStore from './stores/UserStore';
import ModalStore from './stores/ModalStore';

import Posts from './views/Posts';
import Modal from './components/Modal';
import Login from './components/Login';
import Register from './components/Register';
import NewPost from './components/NewPost';
import LoginLinks from './components/LoginLinks';
import ProfileLink from './components/ProfileLink';
import Icon from './components/Icon';

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
        if (!oldModalState.type && newModalState.type) {
            document.addEventListener('keyup', onKeyUp);
        } else if (oldModalState.type && !newModalState.type) {
            document.removeEventListener('keyup', onKeyUp);
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

    getModalComponent(modal) {
        if (!modal.type) {
            return null;
        }

        let modalInner;
        let modalProps = {
            user: this.state.user,
            errorMessage: modal.errorMessage
        };

        switch (modal.type) {
            case 'register':
                modalInner = <Register { ...modalProps } />; break;
            case 'login':
                modalInner = <Login { ...modalProps } />; break;
            case 'newpost':
                modalInner = <NewPost { ...modalProps } />;
        }

        return (
            <Modal hideModal={ this.hideModal }>
                { modalInner }
            </Modal>
        );
    },

    render() {
        let { user, modal } = this.state;

        return (
            <div className="wrapper full-height">
                <header className="header cf">
                    <div className="float-left">
                        <Link to="/" className="menu-title">
                            <span>react-news</span>
                        </Link>
                    </div>
                    <div className="float-right">
                        { user.isLoggedIn ? <ProfileLink user={ user } /> : <LoginLinks /> }
                        <a className="newpost-link" onClick={ this.newPost }>
                            <Icon svg={ require('../svg/add.svg') } />
                            <span className="sr-only">New Post</span>
                        </a>
                    </div>
                </header>

                <main id="content" className="full-height inner">
                    { this.props.children || <Posts /> }
                </main>

                { this.getModalComponent(modal) }
            </div>
        );
    }
});

export default App;
