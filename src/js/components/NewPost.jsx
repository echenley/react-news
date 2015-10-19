'use strict';

import React, { PropTypes } from 'react';
import { History } from 'react-router';
import cx from 'classnames';

import Actions from '../actions/Actions';
import Spinner from '../components/Spinner';

const NewPost = React.createClass({

    propTypes: {
        user: PropTypes.object,
        errorMessage: PropTypes.string
    },

    mixins: [ History ],

    getInitialState() {
        return {
            submitted: false,
            title: '',
            link: ''
        };
    },

    componentWillReceiveProps(nextProps) {
        const oldLatestPost = this.props.user.latestPost;
        const newLatestPost = nextProps.user.latestPost;

        if (oldLatestPost !== newLatestPost) {
            // user just submitted a new post
            return this.submitPostCompleted(newLatestPost);
        }

        this.setState({
            submitted: false
        });
    },

    submitPostCompleted(postId) {
        // clear form
        this.setState({
            title: '',
            link: '',
            submitted: false
        });

        // hide modal/redirect to the new post
        Actions.hideModal();
        this.history.pushState(null, `/post/${postId}`);
    },

    submitPost(e) {
        e.preventDefault();

        const { title, link } = this.state;
        const { user } = this.props;

        if (!title) {
            this.setState({
                highlight: 'title'
            });
            return;
        }

        if (!link) {
            this.setState({
                highlight: 'link'
            });
            return;
        }

        this.setState({
            submitted: true
        });

        const post = {
            title: title.trim(),
            url: link,
            creator: user.username,
            creatorUID: user.uid,
            time: Date.now()
        };

        Actions.submitPost(post);
    },

    render() {
        const { submitted, highlight, title, link } = this.state;

        const titleInputCx = cx('panel-input', {
            'input-error': highlight === 'title'
        });

        const linkInputCx = cx('panel-input', {
            'input-error': highlight === 'link'
        });

        const errorMessage = this.props.errorMessage;
        const error = errorMessage && (
            <div className="error modal-form-error">{ errorMessage }</div>
        );

        return (
            <div className="newpost">
                <h1>New Post</h1>
                <form onSubmit={ this.submitPost } className="modal-form">
                    <label htmlFor="newpost-title">Title</label>
                    <input
                        type="text"
                        className={ titleInputCx }
                        placeholder="Title"
                        id="newpost-title"
                        value={ title }
                        onChange={ (e) => this.setState({ title: e.target.value }) }
                    />
                    <label htmlFor="newpost-url">Link</label>
                    <input
                        type="text"
                        className={ linkInputCx }
                        placeholder="Link"
                        id="newpost-url"
                        value={ link }
                        onChange={ (e) => this.setState({ link: e.target.value.trim() }) }
                    />
                    <button type="submit" className="button button-primary" disabled={ submitted }>
                        { submitted ? <Spinner /> : 'Submit' }
                    </button>
                </form>
                { error }
            </div>
        );
    }
});

export default NewPost;
