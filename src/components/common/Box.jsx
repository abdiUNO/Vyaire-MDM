import styled, { css } from 'styled-components/native';
import { View, Text, TextInput } from 'react-native-web';
import {
    space,
    color,
    layout,
    flexbox,
    typography,
    fontWeight,
    shadow,
    border,
    compose,
    system,
    background,
} from 'styled-system';

// theme.js

const whiteSpace = system({
    whiteSpace: {
        property: 'whiteSpace',
        cssProperty: 'whiteSpace',
    },
});

const commonProps = compose(space, layout, color, background);
export const fontProps = compose(typography, fontWeight, whiteSpace);
export const borderProps = compose(border, shadow);

export const Box = styled(View)`
    box-sizing: border-box;
    min-height: ${props => props.fullHeight && '100vh'};
    ${props => props.centerContent && 'justify-content:center'};
    ${props => props.alignItems && `align-items : ${props.alignItems}`}
    ${flexbox}
    ${commonProps};
    ${fontProps};
    ${borderProps};
`;

Box.displayName = 'Box';
