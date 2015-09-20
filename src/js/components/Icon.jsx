'use strict';

import React, { PropTypes } from 'react/addons';

const Icon = React.createClass({
    propTypes: {
        svg: PropTypes.string.isRequired
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
