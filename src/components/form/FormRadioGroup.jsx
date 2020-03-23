import { omit, pick } from '@styled-system/props';
import React, { createContext } from 'react';
import memoize from 'memoize-one';
import { Text, Select, Label } from '../common';
import Wrapper from './Wrapper';
import { Box } from '../common/Box';
import { View } from 'react-native';

const RadioGroupContext = createContext();

export function FormRadio({
    name,
    value: inputValue,
    type,
    placeholder,
    onChange,
    error,
    children,
    variant,
    inline,
    disabled,
    label,
    ...rest
}) {
    const wrapperProps = {
        display: inline && 'flex',
        ...pick(rest),
        width: '100%',
        flexDirection: inline ? 'row' : 'column',
        alignItems: inline && 'center',
    };

    const inputProps = omit(rest);

    return (
        <RadioGroupContext.Consumer>
            {({ value, name, onChange }) => (
                <Wrapper {...wrapperProps} pb={'10px'} alignItems="center">
                    <input
                        type="radio"
                        id={inputValue}
                        name={name}
                        value={inputValue}
                        checked={inputValue === value}
                        onChange={
                            onChange &&
                            (() =>
                                onChange(inputValue, {
                                    target: { name },
                                }))
                        }
                        style={{ marginRight: '10px' }}
                    />
                    <span
                        onClick={
                            onChange &&
                            (() =>
                                onChange(inputValue, {
                                    target: { name },
                                }))
                        }>
                        <label
                            htmlFor={name}
                            style={{ fontSize: '15px', fontFamily: 'Poppins' }}>
                            {inputValue}
                        </label>
                    </span>
                </Wrapper>
            )}
        </RadioGroupContext.Consumer>
    );
}

function FormRadioGroup({
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
}) {
    const createContextValue = memoize((value, name, onChange) => ({
        value,
        name,
        onChange,
    }));

    const wrapperProps = {
        display: inline && 'flex',
        ...pick(rest),
        width: '100%',
        flexDirection: inline ? 'row' : 'column',
        alignItems: inline && 'center',
    };
    const inputProps = omit(rest);
    return (
        <RadioGroupContext.Provider
            value={createContextValue(value, name, onChange)}>
            <Wrapper {...wrapperProps} py={'10px'}>
                <Label
                    as={'span'}
                    disabled={disabled}
                    inline={`${inline}`}
                    variant={variant}
                    marginBottom="8px">
                    {label}
                    {!inline && rest.required ? (
                        <Box
                            as="span"
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            pl={error && '2px'}>
                            <Text
                                as="span"
                                color="red"
                                fontWeight="500"
                                fontFamily="Poppins"
                                fontSize="19px">
                                {'*'}
                            </Text>
                            {error && (
                                <Text
                                    as="span"
                                    color="red"
                                    fontWeight="400"
                                    fontSize="14px">
                                    {error}
                                </Text>
                            )}
                        </Box>
                    ) : (
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            pl={error && '2px'}>
                            {error && (
                                <Text
                                    color="red"
                                    fontWeight="400"
                                    fontSize="14px">
                                    {error}
                                </Text>
                            )}
                        </Box>
                    )}
                </Label>
                {children}
            </Wrapper>
        </RadioGroupContext.Provider>
    );
}

export default FormRadioGroup;
