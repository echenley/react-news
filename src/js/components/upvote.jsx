'use strict';

import React from 'react/addons';
import Actions from '../actions/Actions';

import cx from 'classnames';

let lastUpvoteState;

const Upvote = React.createClass({

    propTypes: {
        isUpvoted: React.PropTypes.bool,
        user: React.PropTypes.object,
        itemId: React.PropTypes.string,
        upvoteActions: React.PropTypes.object,
        upvotes: React.PropTypes.string
    },

    getInitialState() {
        return {
            updating: false,
            upvoted: this.props.isUpvoted
        };
    },

    componentWillReceiveProps(nextProps) {
        let oldUpvoted = this.props.user.profile.upvoted;
        let newUpvoted = nextProps.user.profile.upvoted;

        // don't update unless upvoted changes
        if (oldUpvoted === newUpvoted) {
            console.log('return early');
            return;
        }

        this.setState({
            updating: false,
            upvoted: nextProps.isUpvoted
        });
    },

    upvote() {
        if (this.state.updating) {
            console.log('disabled');
            return;
        }

        if (!this.props.user.isLoggedIn) {
            Actions.showModal('login', 'LOGIN_REQUIRED');
            return;
        }

        this.setState({
            upvoted: !this.state.upvoted
        });

        let userId = this.props.user.uid;
        let itemId = this.props.itemId;
        let upvoted = this.state.upvoted;

        let upvoteActions = this.props.upvoteActions;
        let upvoteAction = upvoted
            ? upvoteActions.downvote
            : upvoteActions.upvote;

        // don't do anything if nothing changed
        if (upvoted === lastUpvoteState) {
            return;
        }

        // wait for action to complete before allowing upvote
        this.setState({
            updating: true
        });

        upvoteAction(userId, itemId);
    },

    render() {
        let upvotes = this.props.upvotes;

        let upvoteCx = cx(
            'upvote', {
            'upvoted': this.state.upvoted,
            'updating': this.state.updating
        });

        return (
            <a className={ upvoteCx } onClick={ this.upvote }>
                { upvotes } <i className="fa fa-arrow-up"></i>
            </a>
        );
    }

});

export default Upvote;
