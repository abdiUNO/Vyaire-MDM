import { omit, pick } from '@styled-system/props';
import React from 'react';
import { Text, Select, Label } from '../common';
import Wrapper from './Wrapper';
import { Box } from '../common/Box';

function FormSelect({
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
    const wrapperProps = {
        display: inline && 'flex',
        ...pick(rest),
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
            <Select
                as={'select'}
                minHeight={!inline && 38 + 0.5}
                variant={variant}
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={onChange && (e => onChange(e.target.value, e))}
                value={value === null ? '' : value}
                error={error}
                {...inputProps}>
                {children}
            </Select>
        </Wrapper>
    );
}

export default FormSelect;
