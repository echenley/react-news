'use strict';

var React = require('react/addons');

// actions
var actions = require('../actions/actions');

// components
var Link = require('react-router').Link;
var Upvote = require('./upvote');

var Post = React.createClass({

    mixins: [
        require('../mixins/pluralize'),
    	require('../mixins/abbreviateNumber'),
    	require('../mixins/hostnameFromUrl'),
        require('../mixins/timeAgo')
    ],

    render: function () {
        var user = this.props.user;
        var post = this.props.post;

        var commentCount = post.commentCount || 0;

        var deleteOption = '';
        if (user.uid === post.creatorUID) {   
            deleteOption = (
                <span className="delete post-info-item">
                    <a onClick={ actions.deletePost.bind(this, post.id) }>delete</a>
                </span>
            );
        }

        var upvoteActions = {
            upvote: actions.upvotePost,
            downvote: actions.downvotePost
        };

        return (
            <div className="post cf fade-in">
                <div className="post-link">
                    <a className="post-title" href={ post.url }>{ post.title }</a>
                    <span className="hostname">
                        (<a href={ post.url }>{ this.hostnameFromUrl(post.url) }</a>)
                    </span>
                </div>
                <div className="post-info">
                    <div className="posted-by float-left">
                        <Link to="profile" params={{ username: post.creator }}>{ post.creator }</Link>
                        <span className="post-info-item">
                            { this.timeAgo(post.time) }
                        </span>
                        <span className="post-info-item">
                            <Link to="post" params={{ postId: post.id }}>
                                { this.pluralize(commentCount, 'comment') }
                            </Link>
                        </span>
                        { deleteOption }
                    </div>
                    <div className="float-right">
                    	<Upvote
                            upvoteActions= { upvoteActions }
                    		user={ user }
                    		itemId={ post.id }
                    		upvotes={ post.upvotes ? this.abbreviateNumber(post.upvotes) : 0 } />
                    </div>
                </div>
            </div>
        );
    }
    
});

module.exports = Post;