import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
    padding-left: ${props => {
        if (props.full) return 0;
        if (props.paddingLeft) return props.paddingLeft;
        return 'calc((100vw - 960px) / 2)';
    }};
    padding-right: ${props => {
        if (props.full) return 0;
        if (props.paddingRight) return props.paddingRight;

        return 'calc((100vw - 960px) / 2)';
    }};
    padding-top: ${props => {
        if (props.fullVertical) return 0;
        if (props.small) return '15px';
        if (props.paddingTop) return props.paddingTop;

        return '25px';
    }};
    padding-bottom: ${props => {
        if (props.fullVertical) return 0;
        if (props.small) return '15px';
        if (props.paddingBottom) return props.paddingBottom;

        return '25px';
    }};
`;

export default Container;
