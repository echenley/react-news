'use strict';

var Reflux = require('reflux');
var Actions = require('../actions/Actions');

var Spinner = require('../components/Spinner');

var cx = require('classnames');

var NewPost = React.createClass({

    mixins: [
        Reflux.listenTo(Actions.submitPost.completed, 'onSuccess'),
        Reflux.listenTo(Actions.submitPost.failed, 'onError')
    ],

    getInitialState() {
        return {
            errorMessage: '',
            submitted: false
        };
    },

    componentDidMount() {
        React.findDOMNode(this.refs.postTitle).focus();
    },

    componentWillUpdate() {
        React.findDOMNode(this.refs.postTitle).focus();
    },


    resetForm() {
        this.setState({
            submitted: false
        });
        React.findDOMNode(this.refs.title).value = '';
        React.findDOMNode(this.refs.link).value = '';
        React.findDOMNode(this.refs.submit).disabled = false;
    },

    onError(errorCode) {
        React.findDOMNode(this.refs.submit).disabled = false;

        console.log(errorCode);

        this.setState({
            errorMessage: 'Something went wrong.',
            submitted: false
        });
    },

    onSuccess() {
        React.findDOMNode(this.refs.postTitle).value = '';
        React.findDOMNode(this.refs.postLink).value = '';
    },

    submitPost(e) {
        e.preventDefault();

        var postTitle = React.findDOMNode(this.refs.postTitle);
        var postLink = React.findDOMNode(this.refs.postLink);

        var user = this.state.user;

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

        var post = {
            title: postTitle.value.trim(),
            url: postLink.value.trim(),
            creator: user.profile.username,
            creatorUID: user.uid,
            time: Date.now()
        };

        Actions.submitPost(post);
    },

    render() {
        var highlight = this.state.highlight;

        var titleInputCx = cx(
            'panel-input', {
            'input-error': highlight === 'title'
        });

        var linkInputCx = cx(
            'panel-input', {
            'input-error': highlight === 'link'
        });

        var error = this.state.error && (
            <div className="error md-form-error">{ error }</div>
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

module.exports = NewPost;
