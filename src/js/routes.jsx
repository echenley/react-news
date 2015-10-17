'use strict';

import React from 'react';
import { Router, Route, Redirect } from 'react-router';

import App from './App';
import Posts from './views/Posts';
import SinglePost from './views/Single';
import Profile from './views/Profile';
import UhOh from './views/404';

export default (
    <Router>
        <Route component={ App }>
            <Route name="posts" path="/posts/:pageNum" component={ Posts } ignoreScrollBehavior />
            <Route name="post" path="/post/:postId" component={ SinglePost } />
            <Route name="profile" path="/user/:username" component={ Profile } />
            <Route name="404" path="/404" component={ UhOh } />
            {/* Redirects */}
            <Redirect from="/" to="/posts/1" />
            <Redirect from="*" to="/404" />
        </Route>
    </Router>
);
