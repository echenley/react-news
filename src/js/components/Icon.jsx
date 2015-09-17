'use strict';

import React from 'react/addons';

const Icon = React.createClass({
    propTypes: {
        svg: React.PropTypes.string.isRequired,
    },

    render() {
        return (
            <i { ...this.props }
               svg={ null }
               dangerouslySetInnerHTML={ { __html: this.props.svg } }>
            </i>
        );
    }
});

export default Icon;
