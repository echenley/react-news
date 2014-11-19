'use strict';

var React = require('react/addons');

var abbreviateNumber = require('../mixins/abbreviateNumber'),
	hostnameFromUrl = require('../mixins/hostnameFromUrl');

// components
var Link = require('react-router').Link,
	Upvote = require('./upvote');

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
                    	<Upvote
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

                        // <input
                        //     className="upvote hidden"
                        //     type="checkbox"
                        //     checked={ this.state.upvoted }
                        //     id={ upvoteId }
                        //     onChange={ this.upvote.bind(this, user.uid, postId) } />
                        // <label htmlFor={ upvoteId } className="pointer">
                        //     { upvotes } <i className="fa fa-arrow-up"></i>
                        // </label>

});

module.exports = Post;