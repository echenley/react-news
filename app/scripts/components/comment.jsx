'use strict';

var React = require('react/addons');

// mixins
var abbreviateNumber = require('../mixins/abbreviateNumber');

// actions
var commentActions = require('../actions/commentActions');

// components
var Link = require('react-router').Link;
var Upvote = require('./upvote');

var Comment = React.createClass({

    mixins: [abbreviateNumber],

    render: function() {
        var comment = this.props.comment;

        var upvoteActions = {
            upvote: commentActions.upvote,
            downvote: commentActions.downvote
        };

        return (
            <div className="comment cf">
                <div className="comment-text">
                    { comment.text }
                </div>
                <div className="comment-info">
		            <div className="posted-by float-left">
		                Posted by <Link to="profile" params={{ username: comment.creator }}>{ comment.creator }</Link>
		            </div>
		            <div className="float-right">
                    	<Upvote
                            upvoteActions={ upvoteActions }
                    		user={ this.props.user }
                    		itemId={ comment.id }
                    		upvotes={ comment.upvotes ? this.abbreviateNumber(comment.upvotes) : 0 } />
		            </div>
	            </div>
            </div>
        );
    }

});

module.exports = Comment;