'use strict';

var React = require('react/addons');

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

    upvote: function (userId, itemId) {
        if (!userId) {
            return;
        }

        var upvoted = this.state.upvoted;
        var actions = this.props.upvoteActions;

        if (upvoted) {
            actions.downvote(userId, itemId);
        } else {
            actions.upvote(userId, itemId);
        }

        this.setState({
            upvoted: !upvoted
        });
    },

    render: function () {
        var cx = React.addons.classSet;

        var userId = this.props.user.uid;
        var itemId = this.props.itemId;
        var upvotes = this.props.upvotes;

        var upvoted = this.state.upvoted;
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