'use strict';

import React from 'react/addons';
import Reflux from 'reflux';
import { Navigation } from 'react-router';
import cx from 'classnames';

import Actions from '../actions/Actions';
import Spinner from '../components/Spinner';

const NewPost = React.createClass({

    propTypes: {
        user: React.PropTypes.object,
        errorMessage: React.PropTypes.string
    },

    mixins: [
        Navigation,
        Reflux.listenTo(Actions.submitPost.completed, 'submitPostCompleted')
    ],

    getInitialState() {
        return {
            submitted: false,
            title: '',
            link: ''
        };
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps === this.props) {
            return;
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
        this.transitionTo('/post/' + postId);
    },

    submitPost(e) {
        e.preventDefault();

        let { title, link } = this.state;
        let { user } = this.props;

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

        let post = {
            title: title,
            url: link,
            creator: user.profile.username,
            creatorUID: user.uid,
            time: Date.now()
        };

        Actions.submitPost(post);
    },

    render() {
        let {
            submitted,
            highlight,
            title,
            url
        } = this.state;

        let titleInputCx = cx('panel-input', {
            'input-error': highlight === 'title'
        });

        let linkInputCx = cx('panel-input', {
            'input-error': highlight === 'link'
        });

        let errorMessage = this.props.errorMessage;
        let error = errorMessage && (
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
                        onChange={ (e) => this.setState({ title: e.target.value.trim() }) }
                    />
                    <label htmlFor="newpost-url">Title</label>
                    <input
                        type="text"
                        className={ linkInputCx }
                        placeholder="Link"
                        id="newpost-url"
                        value={ title }
                        onChange={ (e) => this.setState({ title: e.target.value.trim() }) }
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
