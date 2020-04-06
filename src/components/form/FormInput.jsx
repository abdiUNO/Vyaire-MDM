/**
 * @prettier
 */

import { omit, pick } from '@styled-system/props';
import React from 'react';
import { Text, TextInput, Label, DatePicker } from '../common';
import Wrapper from './Wrapper';
import { Box } from '../common/Box';
import { FieldValue as TextValue } from '../common/TextInput';

function FormInput({
    rightComponent: RightComponent,
    name,
    maxLength,
    type,
    placeholder,
    labelColor,
    delta,
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

    if (delta) inputProps.value = delta.UpdatedValue;

    let labelText = label && inline && colon ? `${label}:` : label;

    labelText = delta ? `+ ${labelText}` : labelText;

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
                color={delta ? '#239d56' : null}
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
                            onChange && ((e) => onChange(e.target.value, e))
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
                            onChange && ((e) => onChange(e.target.value, e))
                        }
                        onBlur={onBlur && ((e) => onBlur(e.target.value, e))}
                        defaultValue={value}
                        {...inputProps}
                    />
                )}
                {RightComponent && <RightComponent />}
            </Box>
        </Wrapper>
    );
}

export function FieldLabel({
    rightComponent: RightComponent,
    inline = true,
    label,
    colon = true,
    disabled,
    error,
    ...rest
}) {
    const wrapperProps = {
        display: inline ? 'flex' : null,
        ...pick(rest),
        width: '100%',
        flexDirection: inline ? 'row' : 'column',
        alignItems: inline && 'center',
    };

    const labelText = label && inline && colon ? `${label}:` : label;

    return (
        <Label
            {...wrapperProps}
            width="60%"
            mt={colon === false && '5px'}
            htmlFor={name}
            disabled={disabled}
            inline={`${inline}`}
            variant="outline">
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
    );
}

export function FieldValue({
    rightComponent: RightComponent,
    name,
    error,
    children,
    color,
    ...rest
}) {
    const wrapperProps = {
        ...pick(rest),
    };

    const inputProps = omit(rest);

    return (
        <Box
            display={RightComponent ? 'flex' : null}
            flexDirection={RightComponent && 'row'}
            alignItems={RightComponent && 'center'}>
            <TextValue
                spellCheck={false}
                error={error}
                {...inputProps}
                color={color}>
                {children}
            </TextValue>
            {RightComponent && <RightComponent />}
        </Box>
    );
}

export function Field({
    rightComponent: RightComponent,
    upperCase,
    inline,
    name,
    error,
    colon = true,
    children,
    ...rest
}) {
    const wrapperProps = {
        display: inline ? 'flex' : null,
        ...pick(rest),
        width: '100%',
        flexDirection: inline ? 'row' : 'column',
        alignItems: inline && 'center',
    };

    return (
        <Wrapper
            {...wrapperProps}
            upperCase={upperCase}
            py={inline ? '4px' : '8px'}>
            {children}
        </Wrapper>
    );
}

export default FormInput;
