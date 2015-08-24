'use strict';

function createParent(Child, ref, props) {
    const React = require('react/addons');

    return React.createClass({
        getInitialState() {
            return props;
        },

        render() {
            let convertedProps = {};

            for (let prop in props) {
                convertedProps[prop] = this.state[prop];
            }

            return <Child ref={ ref } { ...convertedProps } />;
        }
    });
}

export default createParent;