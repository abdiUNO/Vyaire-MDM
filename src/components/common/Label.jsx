import styled from 'styled-components';
import { COMMON, LAYOUT, TYPOGRAPHY } from '../constants';

const Label = styled.label.attrs(props => ({
    htmlFor: props.htmlFor || '',
}))`
    line-height: ${props => (props.variant === 'outline' ? 1 : 1.8)};
    letter-spacing: 0.07px;
    display: inline-flex;
    white-space: pre;
    box-sizing: content-box;
    flex-direction: row;
    align-items: flex-end;
    vertical-align: middle;

    ${props =>
        props.inline &&
        `
        margin-right:15px;
    `};

    font-size: 16px;
    font-weight: 500;
    font-family: Poppins, serif;
    background-color: transparent;
    color: ${props => (props.disabled ? '#58595B' : '#22438a')};
    &:focus {
        outline: 0;
    }

    ${COMMON}
    ${LAYOUT}
    ${TYPOGRAPHY}
`;

export default Label;
