'use strict';

/*
    Returns component wrapped in parent component. Enables testing
    componentWillReceiveProps in child component via parent.setState().
    Inspired by http://jaketrent.com/post/test-react-componentwillreceiveprops/
*/

function createParent(Child, ref, props) {
    const React = require('react');
    props = props || {};

    return React.createClass({
        getInitialState() {
            return props;
        },

        render() {
            let convertedProps = {};
            let children = null;

            for (let prop in props) {
                if (prop === 'children') {
                    children = this.state[prop];
                } else {
                    convertedProps[prop] = this.state[prop];                    
                }
            }

            return (
                <Child ref={ ref || 'child' } { ...convertedProps }>
                    { children }
                </Child>
            );
        }
    });
}

export default createParent;