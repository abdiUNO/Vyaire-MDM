import { Flex, Text } from '../components/common';
import { CheckBox } from 'react-native';
import React from 'react';

export const CheckBoxItem = ({
    name,
    title,
    onValueChange,
    stateValue,
    inputProps,
}) => (
    <>
        <Flex
            alignLeft
            style={{
                paddingTop: 15,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10,
                paddingRight: 15,
                marginBottom: 10,
                marginHorizontal: 25,
                maxWidth: '350px',
                width: '100%',
            }}>
            <CheckBox
                name={name}
                value={stateValue}
                onValueChange={onValueChange}
                {...inputProps}
            />
            <Text
                my={2}
                fontSize="16px"
                fontWeight="500"
                fontFamily="Poppins"
                backgroundColor="transparent"
                color="#22438a"
                pl={4}>
                {title}
            </Text>
        </Flex>
    </>
);
