'use strict';

var React = require('react/addons');
var postActions = require('../actions/postActions');

var Upvote = React.createClass({

    getInitialState: function () {
        return {
            upvoted: false
        };
    },

    componentDidMount: function () {
        var upvoted = this.props.user.profile.upvoted || {};
        this.setState({
            upvoted: upvoted[this.props.itemId]
        });
    },

    upvote: function (userId, postId) {
        if (!userId) {
            return;
        }

        var upvoted = this.state.upvoted;

        if (upvoted) {
            postActions.downvote(userId, postId);
        } else {
            postActions.upvote(userId, postId);
        }

        this.setState({
            upvoted: !upvoted
        });
    },

    render: function() {
        var cx = React.addons.classSet;

        var userId = this.props.user.uid;
        var itemId = this.props.itemId;

        var upvoted = this.state.upvoted;
        var upvotes = this.props.upvotes;
        var upvoteCx = cx({
            'upvote': true,
            'upvoted': upvoted
        });

        return (
            <a className={ upvoteCx } onClick={ this.upvote.bind(this, userId, itemId) }>
                { upvotes } <i className="fa fa-arrow-up"></i>
            </a>
        );
    }

});

module.exports = Upvote;