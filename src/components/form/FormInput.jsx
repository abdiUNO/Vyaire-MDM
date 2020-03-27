/**
 * @prettier
 */

import { omit, pick } from '@styled-system/props';
import React from 'react';
import { Text, TextInput, Label, DatePicker } from '../common';
import Wrapper from './Wrapper';
import { Box } from '../common/Box';
function FormInput({
    rightComponent: RightComponent,
    name,
    maxLength,
    type,
    placeholder,
    onChange,
    value,
    error,
    colon = true,
    children,
    variant,
    multiline,
    numberOfLines,
    readOnly,
    inline,
    onBlur,
    disabled,
    label,
    upperCase,
    ...rest
}) {
    const wrapperProps = {
        display: inline ? 'flex' : null,
        ...pick(rest),
        width: '100%',
        flexDirection: inline ? 'row' : 'column',
        alignItems: inline && 'center',
    };
    const inputProps = omit(rest);

    const labelText = label && inline && colon ? `${label}:` : label;

    return (
        <Wrapper
            {...wrapperProps}
            upperCase={upperCase}
            py={inline ? '4px' : '8px'}>
            <Label
                width="60%"
                mt={colon === false && '5px'}
                htmlFor={name}
                disabled={disabled}
                inline={`${inline}`}
                variant={variant}>
                {labelText}
                {!inline && rest.required ? (
                    <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        pl={error && '2px'}>
                        <Text
                            color="red"
                            fontWeight="500"
                            fontFamily="Poppins"
                            fontSize="19px">
                            {'*'}
                        </Text>
                        {error && (
                            <Text color="red" fontWeight="400" fontSize="14px">
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
                            <Text color="red" fontWeight="400" fontSize="14px">
                                {error}
                            </Text>
                        )}
                    </Box>
                )}
            </Label>
            <Box
                display={RightComponent ? 'flex' : null}
                flexDirection={RightComponent && 'row'}
                alignItems={RightComponent && 'center'}>
                {type === 'date' ? (
                    <DatePicker
                        variant={variant}
                        type={type}
                        disabled={variant === 'outline'}
                        name={name}
                        placeholder={placeholder}
                        onChange={
                            onChange && (e => onChange(e.target.value, e))
                        }
                        defaultValue={value}
                        {...inputProps}
                    />
                ) : (
                    <TextInput
                        spellCheck={false}
                        autoComplete={name}
                        autoCorrect={false}
                        editable={!readOnly}
                        variant={variant}
                        type={type}
                        disabled={variant === 'outline' || disabled}
                        multiline={multiline}
                        error={error}
                        numberOfLines={numberOfLines}
                        name={name}
                        maxLength={maxLength}
                        placeholder={placeholder}
                        onChange={
                            onChange && (e => onChange(e.target.value, e))
                        }
                        onBlur={onBlur && (e => onBlur(e.target.value, e))}
                        defaultValue={value}
                        {...inputProps}
                    />
                )}
                {RightComponent && <RightComponent />}
            </Box>
        </Wrapper>
    );
}

export default FormInput;
