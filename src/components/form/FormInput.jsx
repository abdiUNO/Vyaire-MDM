import { omit, pick } from '@styled-system/props';
import React from 'react';
import { Text, TextInput, Label, DatePicker } from '../common';
import Wrapper from './Wrapper';

const FormInput = ({
    name,
    type,
    placeholder,
    onChange,
    value,
    error,
    children,
    variant,
    multiline,
    numberOfLines,
    inline,
    disabled,
    label,
    ...rest
}) => {
    const wrapperProps = {
        display: inline && 'flex',
        ...pick(rest),
        width: '100%',
        flexDirection: inline ? 'row' : 'column',
        alignItems: inline && 'center',
    };
    const inputProps = omit(rest);
    const labelText = inline ? `${label}:` : label;

    return (
        <Wrapper {...wrapperProps} py={inline ? '4px' : '8px'}>
            <Label
                width='50%'
                htmlFor={name}
                disabled={disabled}
                inline={`${inline}`}
                variant={variant}>
                {labelText}
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
            {type === 'date' ? (
                <DatePicker
                    variant={variant}
                    type={type}
                    disabled={variant === 'outline'}
                    name={name}
                    placeholder={placeholder}
                    onChange={onChange}
                    value={value}
                    {...inputProps}
                />
            ) : (
                <TextInput
                    variant={variant}
                    type={type}
                    disabled={variant === 'outline'}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    name={name}
                    placeholder={placeholder}
                    onChange={onChange && (e => onChange(e.target.value, e))}
                    value={value}
                    {...inputProps}
                />
            )}

            {error && <p>{error}</p>}
        </Wrapper>
    );
};

export default FormInput;
