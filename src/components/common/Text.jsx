import React from 'react';
import { Text, StyleSheet } from 'react-native';

import { Typography } from '../../theme/';
import normalize from './normalizeText';

const patchWebProps = ({ ...rest }) => {
    return rest;
};

const TextElement = props => {
    const { style, children, fontWeight, fontSize, ...rest } = props;

    const fontStyle = {
        ...(Typography[fontWeight] || Typography.regular),
        fontSize: normalize(fontSize || 15),
    };
    return (
        <Text
            style={StyleSheet.flatten([fontStyle, style && style])}
            {...patchWebProps(rest)}>
            {children}
        </Text>
    );
};

export default TextElement;
