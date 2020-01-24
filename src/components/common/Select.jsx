import styled from 'styled-components';
import { COMMON, LAYOUT, get } from '../constants';

const Select = styled.select`
    display: flex;
    flex: 4 1 auto;
    box-sizing: border-box;
    box-shadow: ${get('shadows.formControl')};
    border-style: solid;
    min-width: 200px;
    width: 100%;
    font-weight: 500;
    color: #797a7c;

    border-width: 1px;
    border-radius: 2.5px;
    border-color: #ededed;
    opacity: 1;
    font-size: 16px;

    padding: ${props =>
        props.inline
            ? '0.25rem 0.25rem 0.2rem 0.75rem'
            : '0.4rem 0.25rem 0.2rem 0.75rem'};

    vertical-align: middle;
    line-height: ${props => (props.inline || props.disabled ? 1 : 2.075)};

    &:focus {
        outline: none;
        box-shadow: ${props =>
            props.variant === 'solid' && `${get('shadows.formControlFocus')}`};
    }

    appearance: none;

    background-image: linear-gradient(45deg, transparent 50%, gray 50%),
        linear-gradient(135deg, gray 50%, transparent 50%),
        linear-gradient(to right, #ccc, #ccc);
    background-position: calc(100% - 20px) calc(1em + 2px),
        calc(100% - 15px) calc(1em + 2px), calc(100% - 2.5em) 0.5em;
    background-size: 5px 5px, 5px 5px, 1px 1.5em;
    background-repeat: no-repeat;
    background-color: #ffffff;

    ${COMMON};
    ${LAYOUT}
`;

export default Select;
