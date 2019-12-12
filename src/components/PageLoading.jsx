import React from 'react';
import styled from 'styled-components/native';
import { Text, View } from 'react-native';
import { Container, Flex } from './common';
import VyaireLogo from './VyaireLogo';

export default function PageLoading() {
    return (
        <Container fullVertical>
            <Flex
                column
                justifyCenter
                alignCenter
                padding="0px 25px"
                fullHeight>
                <View>
                    <svg width="80" height="60" viewBox="5 0 80 60">
                        <path
                            className="wave"
                            fill="none"
                            stroke="#05A5DE"
                            strokeWidth="4"
                            strokeLinecap="round"
                            d="M 0 37.5 c 7.684299348848887 0 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15"
                        />
                    </svg>
                </View>
                <Flex alignCenter>
                    <VyaireLogo width={100} />
                    <Text
                        style={{
                            fontSize: 34,
                            fontWeight: '400',
                            marginLeft: 5,
                            paddingBottom: 5,
                            color: '#05A5DE',
                        }}>
                        MDM
                    </Text>
                </Flex>
            </Flex>
        </Container>
    );
}
