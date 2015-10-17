'use strict';

import React, { PropTypes } from 'react';
import cx from 'classnames';

import Actions from '../actions/Actions';
import abbreviateNumber from '../util/abbreviateNumber';
import Icon from './Icon';

const Upvote = React.createClass({

    propTypes: {
        isUpvoted: PropTypes.bool,
        user: PropTypes.object,
        itemId: PropTypes.string,
        upvoteActions: PropTypes.object,
        upvotes: PropTypes.number
    },

    getInitialState() {
        return {
            updating: false,
            upvoted: this.props.isUpvoted
        };
    },

    componentWillReceiveProps(nextProps) {
        const oldUpvoted = this.props.isUpvoted;
        const newUpvoted = nextProps.isUpvoted;

        // don't update unless upvoted changes
        if (oldUpvoted === newUpvoted) {
            return;
        }

        this.setState({
            updating: false,
            upvoted: nextProps.isUpvoted
        });
    },

    upvote() {
        const { upvoted, updating } = this.state;
        const { user, itemId, upvoteActions } = this.props;

        if (updating) {
            return;
        }

        if (!user.isLoggedIn) {
            Actions.showModal('login', 'LOGIN_REQUIRED');
            return;
        }

        let upvoteAction = upvoted
            ? upvoteActions.downvote
            : upvoteActions.upvote;

        this.setState({
            upvoted: !upvoted,
            // wait for action to complete before allowing upvote
            updating: true
        });

        upvoteAction(user.uid, itemId);
    },

    render() {
        const { upvoted, updating } = this.state;
        const { upvotes } = this.props;

        let upvoteCx = cx('upvote', {
            'upvoted': upvoted,
            'updating': updating
        });

        return (
            <a className={ upvoteCx } onClick={ this.upvote }>
                <span>{ abbreviateNumber(upvotes) }</span>
                <Icon svg={ require('../../svg/upvote.svg') } />
            </a>
        );
    }

});

export default Upvote;
