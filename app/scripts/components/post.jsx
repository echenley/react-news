'use strict';

var React = require('react/addons');
var postActions = require('../actions/postActions');

var abbreviateNumber = require('../mixins/abbreviateNumber');
var Link = require('react-router').Link;

var Post = React.createClass({

    mixins: [abbreviateNumber],

    upvote: function (userId, postId, alreadyUpvoted) {
        // upvote post
        postActions.upvote(userId, postId, alreadyUpvoted);
    },

    hostnameFromUrl: function (str) {
        var url = document.createElement('a');
        url.href = str;
        return url.hostname;
    },

    render: function() {
        var postId = this.props.post.id;
        var post = this.props.post;
        var user = this.props.user;

        var signedIn = !!user;
        var alreadyUpvoted = user.profile.upvoted ? user.profile.upvoted[postId] : false;

        var upvoteId = 'upvote' + postId;
        var upvotes = post.upvotes ? this.abbreviateNumber(post.upvotes) : 0;

        var commentCount = post.commentCount ? this.abbreviateNumber(post.commentCount) : 0;

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
                        Posted by <Link to="profile" params={{ userId: post.creatorUID }}>{ post.creator }</Link>
                    </div>
                    <div className="float-right">
                        <input
                            className="upvote hidden"
                            type="checkbox"
                            checked={ signedIn && alreadyUpvoted }
                            id={ upvoteId }
                            onChange={ this.upvote.bind(this, user.uid, postId, alreadyUpvoted) } />
                        <label htmlFor={ upvoteId } className="pointer">
                            { upvotes } <i className="fa fa-arrow-up"></i>
                        </label>
                        <Link to="post" params={{ postId: postId }} className="comments-link no-underline">
                            { commentCount } <i className="fa fa-comments"></i>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = Post;