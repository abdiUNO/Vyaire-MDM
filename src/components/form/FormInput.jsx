/**
 * @prettier
 */

import { omit, pick } from '@styled-system/props';
import React from 'react';
import { Text, TextInput, Label, DatePicker } from '../common';
import Wrapper from './Wrapper';
import { Box } from '../common/Box';
const FormInput = ({
    rightComponent: RightComponent,
    name,
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
    const labelText = inline && colon ? `${label}:` : label;

    return (
        <Wrapper {...wrapperProps} py={inline ? '4px' : '8px'}>
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
                display={RightComponent && 'flex'}
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
                        value={value}
                        {...inputProps}
                    />
                ) : (
                    <TextInput
                        variant={variant}
                        type={type}
                        disabled={variant === 'outline'}
                        multiline={multiline}
                        error={error}
                        numberOfLines={numberOfLines}
                        name={name}
                        placeholder={placeholder}
                        onChange={
                            onChange && (e => onChange(e.target.value, e))
                        }
                        value={value}
                        {...inputProps}
                    />
                )}
                {RightComponent && <RightComponent />}
            </Box>
        </Wrapper>
    );
};

export default FormInput;
