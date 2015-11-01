'use strict';

import React, { PropTypes } from 'react';

const Icon = (props) => (
    <i { ...props }
       svg={ null }
       dangerouslySetInnerHTML={ { __html: props.svg } }>
    </i>
);

Icon.propTypes = {
    svg: PropTypes.string.isRequired
};

export default Icon;
