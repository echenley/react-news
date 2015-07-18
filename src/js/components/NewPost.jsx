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
            submitted: false
        };
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps === this.props) {
            return;
        }

        React.findDOMNode(this.refs.submit).disabled = false;
        this.setState({
            submitted: false
        });
    },

    submitPostCompleted(postId) {
        // clear form
        React.findDOMNode(this.refs.postTitle).value = '';
        React.findDOMNode(this.refs.postLink).value = '';
        React.findDOMNode(this.refs.submit).disabled = false;

        // hide modal/redirect to the new post
        Actions.hideModal();
        this.transitionTo('/post/' + postId);
    },

    submitPost(e) {
        e.preventDefault();

        let user = this.props.user;

        let postTitle = React.findDOMNode(this.refs.postTitle);
        let postLink = React.findDOMNode(this.refs.postLink);

        if (postTitle.value.trim() === '') {
            this.setState({
                highlight: 'title'
            });
            return;
        }

        if (postLink.value.trim() === '') {
            this.setState({
                highlight: 'link'
            });
            return;
        }

        React.findDOMNode(this.refs.submit).disabled = true;
        this.setState({
            submitted: true
        });

        let post = {
            title: postTitle.value.trim(),
            url: postLink.value.trim(),
            creator: user.profile.username,
            creatorUID: user.uid,
            time: Date.now()
        };

        Actions.submitPost(post);
    },

    render() {
        let highlight = this.state.highlight;

        let titleInputCx = cx('panel-input', {
            'input-error': highlight === 'title'
        });

        let linkInputCx = cx('panel-input', {
            'input-error': highlight === 'link'
        });

        let errorMessage = this.props.errorMessage;
        let error = errorMessage && (
            <div className="error md-form-error">{ errorMessage }</div>
        );

        return (
            <div className="newpost">
                <h1>New Post</h1>
                <form onSubmit={ this.submitPost } className="md-form">
                    <label htmlFor="newpost-title">Title</label>
                    <input type="text"
                        id="newpost-title"
                        className={ titleInputCx }
                        placeholder="Title"
                        ref="postTitle"
                    />
                    <label htmlFor="newpost-url">Title</label>
                    <input type="url"
                        id="newpost-url"
                        className={ linkInputCx }
                        placeholder="Link"
                        ref="postLink"
                    />
                    <button type="submit"
                        className="button button-primary"
                        ref="submit"
                    >
                        { this.state.submitted ? <Spinner /> : 'Submit' }
                    </button>
                </form>
                { error }
            </div>
        );
    }
});

export default NewPost;
