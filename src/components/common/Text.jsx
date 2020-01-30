import React from 'react';
import { Text, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { COMMON, TYPOGRAPHY } from '../constants';

export const TextElement = styled(Text)`
    margin: 0px;
    min-width: 0px;
    ${props => props.texttransform && `text-transform:${props.texttransform}`};
    ${COMMON}
    ${TYPOGRAPHY}
`;

TextElement.defaultProps = {
    color: 'primary',
    fontFamily: 'Poppins',
    fontSize: 14,
};

export default TextElement;
