import styled from 'styled-components';
import { COMMON, LAYOUT, get } from '../constants';

const DatePicker = styled.input.attrs(props => ({
    type: 'date',
}))`
    display: inline-block;
    box-sizing: border-box;
    box-shadow: ${get('shadows.formControl')};
    border-style: solid;
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
            : '0.3rem 0.25rem 0.3rem 0.75rem'};
    line-height: ${props => (props.inline || props.disabled ? 1 : 2.075)};
    margin-top: ${props => (props.inline ? 0 : '0.125rem')};
    margin-bottom: ${props => (props.inline ? '0.5rem' : 0)};

    &:focus {
        outline: none;
        box-shadow: ${props =>
            props.variant === 'solid' && `${get('shadows.formControlFocus')}`};
    }

    background-color: #ffffff;

    border-width: 1px;
    border-radius: 2.5px;
    border-color: #ededed;

    ${COMMON};
    ${LAYOUT}
`;

export default DatePicker;
