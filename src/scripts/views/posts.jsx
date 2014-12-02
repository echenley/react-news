'use strict';

var Reflux = require('reflux');

// actions
var actions = require('../actions/actions');

// stores
var postsStore = require('../stores/postsStore');

// components
var Spinner = require('../components/spinner');
var Post = require('../components/post');
var Link = require('react-router').Link;

var Posts = React.createClass({

    mixins: [
        Reflux.listenTo(postsStore, 'onStoreUpdate')
    ],

    getInitialState: function () {
        var postsData = postsStore.getDefaultData();
        return {
            posts: postsData.posts,
            sortOptions: postsData.sortOptions,
            loading: true
        };
    },

    statics: {

        willTransitionTo: function (transition, params) {
            
        },

        willTransitionFrom: function (transition, component) {
            
        }
        
    },

    componentWillMount: function () {
        var pageNum = +this.props.params.pageNum || 1;
        actions.setSortBy(this.state.sortOptions.currentValue);
        actions.setPostsPage(pageNum);
    },

    onStoreUpdate: function (postsData) {
        this.setState({
            posts: postsData.posts,
            sortOptions: postsData.sortOptions,
            loading: false
        });
    },

    updateSortBy: function (e) {
        e.preventDefault();

        var sortOptions = this.state.sortOptions;
        sortOptions.currentValue = this.refs.sortBy.getDOMNode().value;

        this.setState({
            loading: true,
            sortOptions: sortOptions
        });

        actions.setSortBy(sortOptions.currentValue);
    },

    previousPage: function () {
        this.setState({
            loading: true
        });
        actions.setPostsPage((+this.props.params.pageNum || 1) - 1);
    },

    nextPage: function () {
        this.setState({
            loading: true
        });
        actions.setPostsPage((+this.props.params.pageNum || 1) + 1);
    },

    render: function () {
        var posts = this.state.posts;
        var pageNum = this.props.params.pageNum || 1;
        var sortOptions = this.state.sortOptions;
        // possible sort values (defined in postsStore)
        var sortValues = Object.keys(sortOptions.values);
        var user = this.props.user;

        posts = posts.map(function (post) {
            return <Post post={ post } user={ user } key={ post.id } />;
        });

        var options = sortValues.map(function (optionText, i) {
            return <option value={ sortOptions[i] } key={ i }>{ optionText }</option>;
        });

        return (
            <div className="content inner fade-in">
                <label htmlFor="sortby-select" className="sortby-label">Sort by </label>
                <div className="sortby">
                    <select
                        id="sortby-select"
                        className="sortby-select"
                        onChange={ this.updateSortBy }
                        value={ sortOptions.currentValue }
                        ref="sortBy">
                        { options }
                    </select>
                </div>
                <hr />
                { this.state.loading ? <Spinner /> : posts }
                <hr />
                <nav className="pagination">
                    <Link to="posts" params={{ pageNum: +pageNum - 1 }} className="previous-page" onClick={ this.previousPage }>Previous</Link>
                    <Link to="posts" params={{ pageNum: +pageNum + 1 }} className="next-page" onClick={ this.nextPage }>Next</Link>
                </nav>
            </div>
        );
    }

});

module.exports = Posts;