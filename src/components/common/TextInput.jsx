import styled from 'styled-components';
import { TextInput } from 'react-native';
import { COMMON, BORDER, FLEX, get, LAYOUT, variant } from '../constants';

const sizeVariants = variant({
    variants: {
        solid: {
            borderWidth: 1,
            borderRadius: 2.5,
            borderColor: '#EDEDED',
            background: '#FFF',
        },
        outline: {
            borderBottomWidth: 'thin !important',
            borderColor: '#6e6e6e',
            boxShadow: 'none',
            backgroundColor: 'transparent',
            px: 2,
        },
        outlineValue: {
            borderBottomWidth: 'none !important',
            borderColor: '#6e6e6e',
            boxShadow: 'none',
            px: 2,
        },
    },
});

const Input = styled(TextInput).attrs(props => ({
    type: props.type || 'text',
}))`
    display: inline-block;
    box-sizing: border-box;
    background-color: transparent;
    box-shadow: ${get('shadows.formControl')};
    min-width: 200px;
    width: 100%;

    font-weight: 500;
    font-size: inherit;
    color: inherit;
    vertical-align: middle;
    opacity: 1;

    padding: ${props =>
        props.inline
            ? '0.25rem 0.25rem 0.2rem 0.75rem'
            : '0.325rem 0.25rem 0.3rem 0.75rem'};
    line-height: ${props => (props.inline || props.disabled ? 1 : 2.075)};
    margin-top: ${props => (props.inline ? 0 : '0.125rem')};
    margin-bottom: ${props => (props.inline ? '0.5rem' : '0.125rem')};

    ${props => props.upperCase && `text-transform:uppercase;`}


    &:focus {
        outline: none;
        box-shadow: ${props =>
            props.variant === 'solid' && `${get('shadows.formControlFocus')}`};
    }

        ${props =>
            props.disabled &&
            `
      background-color: #FBFBFB
      box-shadow: ${get('shadows.small')}
    `}

    ${FLEX}
    ${COMMON};
    ${LAYOUT}
    ${BORDER}
    ${sizeVariants}

    ${props => props.error && `border: 1px solid #ff3f34`}

`;

Input.defaultProps = {
    variant: 'solid',
};

export default Input;
