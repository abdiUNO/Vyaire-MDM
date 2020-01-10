import React, { Component } from 'react';
import { Flex } from '../common';
import { Text, View } from 'react-native';
import Input from '../common/Input';

const FormInput = ({
    text,
    placeholder,
    value,
    required,
    disabled,
    onChange,
}) => (
    <Flex
        justifyAround
        margin="15px 0px 16px 0px"
        style={{
            flexWrap: 'wrap',
            flexDirection: disabled ? 'row' : 'column',
            alignItems: disabled ? 'flex-end' : 'baseline',
        }}>
        <View
            style={[
                {
                    flex: disabled ? 0.45 : 1,
                    marginBottom: 7,
                    flexDirection: 'row',
                },
            ]}>
            <Text
                style={{
                    fontWeight: '500',
                    fontSize: 18,
                    textAlign: 'left',
                    color: !disabled ? '#22438A' : '#63676d',
                }}>
                {text}
            </Text>
            {required ? (
                <Text
                    style={{
                        color: '#e74c3c',
                        fontSize: 25,
                        textAlignVertical: disabled ? 'left' : 'center',
                        paddingRight: 12,
                    }}>
                    *
                </Text>
            ) : (
                <Text
                    style={{
                        color: '#FFFFFF',
                        fontSize: 25,
                        textAlignVertical: disabled ? 'left' : 'center',
                        paddingRight: 12,
                    }}>
                    *
                </Text>
            )}
        </View>
        <Input
            value={value}
            containerstyle={
                !disabled
                    ? {
                          backgroundColor: '#FFF',
                          marginHorizontal: 0,
                          paddingVertical: 11,
                          flex: 4,
                          shadowColor: '#000',
                          shadowOffset: {
                              width: 0,
                              height: 2,
                          },
                          shadowOpacity: 0.2,
                          shadowRadius: 3,
                          elevation: 6,
                          borderRadius: 2.5,
                          borderColor: '#EDEDED',
                          minWidth: 312,
                          height: 27,
                      }
                    : {
                          height: 15,
                          flex: 1 / 2,
                          marginTop: 12,
                          marginHorizontal: 0,
                          paddingVertical: 0,
                          borderTopWidth: 0,
                          borderLeftWidth: 0,
                          borderRightWidth: 0,
                          borderBottomWidth: 1,
                      }
            }
            clear
            required
            labelNumber={4}
            onChange={onChange}
        />
    </Flex>
);

export const FormInputOutline = ({
    text,
    placeholder,
    value,
    required,
    disabled,
    onChange,
}) => (
    <Flex
        justifyAround
        margin="24px 0px 0px 0px"
        style={{
            flexWrap: 'wrap',
            flexDirection: disabled ? 'row' : 'column',
            alignItems: disabled ? 'flex-end' : 'baseline',
        }}>
        <View
            style={[
                {
                    flex: disabled ? 0.45 : 1,
                    marginBottom: 7,
                },
                required && {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                },
            ]}>
            <Text
                style={{
                    fontWeight: '500',
                    fontSize: 18,
                    textAlign: 'left',

                    color: !disabled ? '#22438A' : '#63676d',
                }}>
                {text}
            </Text>
            {required && (
                <Text
                    style={{
                        color: '#e74c3c',
                        fontSize: 25,
                        textAlignVertical: disabled ? 'left' : 'center',
                        paddingRight: 12,
                    }}>
                    *
                </Text>
            )}
        </View>
        <Input
            value={value}
            containerstyle={{
                height: 15,
                flex: 1 / 2,
                marginTop: 16,
                marginHorizontal: 0,
                paddingVertical: 0,
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 1,
                borderColor: '#000000',
            }}
            clear
            required
            labelNumber={4}
            onChange={onChange}
        />
    </Flex>
);

export default FormInput;
