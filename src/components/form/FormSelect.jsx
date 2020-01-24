import { omit, pick } from '@styled-system/props';
import React from 'react';
import { Text, Select, Label } from '../common';
import Wrapper from './Wrapper';

const FormSelect = ({
    name,
    type,
    placeholder,
    onChange,
    value,
    error,
    children,
    variant,
    inline,
    disabled,
    label,
    ...rest
}) => {
    const wrapperProps = {
        ...pick(rest),
        display: inline && 'flex',
        width: '100%',
        flexDirection: inline ? 'row' : 'column',
        alignItems: inline && 'center',
    };
    const inputProps = omit(rest);
    return (
        <Wrapper {...wrapperProps} py={'10px'}>
            <Label
                htmlFor={name}
                disabled={disabled}
                inline={`${inline}`}
                variant={variant}>
                {label}
                {!inline && rest.required ? (
                    <Text
                        color="red"
                        fontWeight="500"
                        fontFamily="Poppins"
                        fontSize="19px">
                        {'*'}
                    </Text>
                ) : null}
            </Label>
            <Select
                as={'select'}
                minHeight={!inline && 38 + 0.5}
                variant={variant}
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                {...inputProps}>
                {children}
            </Select>
            {error && <p>{error}</p>}
        </Wrapper>
    );
};

export default FormSelect;
