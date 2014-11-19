'use strict';

var React = require('react/addons');
var commentActions = require('../actions/commentActions');

var abbreviateNumber = require('../mixins/abbreviateNumber');

// components
var Link = require('react-router').Link,
	Upvote = require('./upvote');

var Comment = React.createClass({

    mixins: [abbreviateNumber],

    upvote: function (userId, commentId, alreadyUpvoted) {
        // add upvote to comment
        commentActions.upvote(userId, commentId, alreadyUpvoted);
    },

    render: function() {
        var comment = this.props.comment;

        return (
            <div className="comment cf">
                <div className="comment-text">
                    { comment.text }
                </div>
                <div className="comment-info">
		            <div className="posted-by float-left">
		                Posted by <Link to="profile" params={{ userId: comment.creatorUID }}>{ comment.creator }</Link>
		            </div>
		            <div className="float-right">
                    	<Upvote
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