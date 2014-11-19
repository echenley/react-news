'use strict';

var React = require('react/addons');

// mixins
var abbreviateNumber = require('../mixins/abbreviateNumber');
var hostnameFromUrl = require('../mixins/hostnameFromUrl');

// actions
var postActions = require('../actions/postActions');

// components
var Link = require('react-router').Link;
var Upvote = require('./upvote');

var Post = React.createClass({

    mixins: [
    	abbreviateNumber,
    	hostnameFromUrl
    ],

    render: function() {
    	var cx = React.addons.classSet;
        var post = this.props.post;

        var commentCount = post.commentCount ? this.abbreviateNumber(post.commentCount) : 0;
        var commentCx = cx({
        	'comments-link': true,
        	'comments-some': commentCount,
        	'no-underline': true
        });

        var upvoteActions = {
            upvote: postActions.upvote,
            downvote: postActions.downvote
        };

        return (
            <div className="post cf">
                <div className="post-link">
                    <a className="post-title" href={ post.url }>{ post.title }</a>
                    <span className="hostname">
                        (<a href={ post.url }>{ this.hostnameFromUrl(post.url) }</a>)
                    </span>
                </div>
                <div className="post-info">
                    <div className="posted-by float-left">
                        Posted by <Link to="profile" params={{ username: post.creator }}>{ post.creator }</Link>
                    </div>
                    <div className="float-right">
                    	<Upvote
                            upvoteActions= { upvoteActions }
                    		user={ this.props.user }
                    		itemId={ post.id }
                    		upvotes={ post.upvotes ? this.abbreviateNumber(post.upvotes) : 0 } />
                        <Link to="post" params={{ postId: post.id }} className={ commentCx }>
                            { commentCount } <i className="fa fa-comments"></i>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    
});

module.exports = Post;