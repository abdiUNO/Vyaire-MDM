import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, Animated, Easing } from 'react-native';
import { Container, Flex, Column } from '../components/common';
import { Link } from 'react-router-dom';

const { Value, ValueXY, timing, stagger, spring, parallel } = Animated;

class HomePage extends Component {
    constructor(props) {
        super(props);

        let anims = [];

        for (let i = 0; i < 3; i++) {
            const opacity = new Animated.Value(0);
            const translateY = opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
            });

            anims.push({ posY: translateY, opacity });
        }

        this.state = {
            animVals: anims,
        };

        this.config = {
            delay: 75,
            duration: 300,
            toValue: 1,
            easing: Easing.ease,
        };

        this.anims = [
            spring(this.state.animVals[0].opacity, this.config),
            spring(this.state.animVals[1].opacity, this.config),
            spring(this.state.animVals[2].opacity, this.config),
        ];

        this.anim = stagger(100, this.anims);
    }

    componentDidMount() {
        this.anim.start();
    }

    render() {
        console.log(this.state);
        return (
            <Container fullVertical>
                <Flex justifyAround alignCenter padding="0px 25px" fullHeight>
                    <Column four padding="0px 15px 50px 15px">
                        <Link to={'/search'}>
                            <Animated.View
                                style={[
                                    styles.box,
                                    {
                                        transform: [
                                            {
                                                translateY: this.state
                                                    .animVals[0].posY,
                                            },
                                        ],
                                        opacity: this.state.animVals[0].opacity,
                                    },
                                ]}>
                                <Image
                                    resizeMode="contain"
                                    style={{
                                        flex: 1,
                                        flexBasis: 'auto',
                                        width: '100%',
                                        height: 150,
                                    }}
                                    source={require('../../assets/icons/custom-master.jpeg')}
                                />
                                <Text
                                    style={
                                        styles.text
                                    }>{`Customer\nMaster`}</Text>
                            </Animated.View>
                        </Link>
                    </Column>

                    <Column four padding="0px 15px 50px 15px">
                        <Animated.View
                            style={[
                                styles.box,
                                {
                                    transform: [
                                        {
                                            translateY: this.state.animVals[1]
                                                .posY,
                                        },
                                    ],
                                    opacity: this.state.animVals[1].opacity,
                                },
                            ]}>
                            <Image
                                resizeMode="contain"
                                style={{
                                    flex: 1,
                                    flexBasis: 'auto',
                                    width: '100%',
                                    height: 150,
                                }}
                                source={require('../../assets/icons/material-master.jpeg')}
                            />
                            <Text
                                style={styles.text}>{`Material\nMaster`}</Text>
                        </Animated.View>
                    </Column>

                    <Column four padding="0px 15px 50px 15px">
                        <Animated.View
                            style={[
                                styles.box,
                                {
                                    transform: [
                                        {
                                            translateY: this.state.animVals[2]
                                                .posY,
                                        },
                                    ],
                                    opacity: this.state.animVals[2].opacity,
                                },
                            ]}>
                            <Image
                                resizeMode="contain"
                                style={{
                                    flex: 1,
                                    flexBasis: 'auto',
                                    width: '100%',
                                    height: 150,
                                }}
                                source={require('../../assets/icons/vendor-master.jpeg')}
                            />
                            <Text style={styles.text}>{`Vendor\nMaster`}</Text>
                        </Animated.View>
                    </Column>
                </Flex>
            </Container>
        );
    }
}

export default HomePage;

const styles = StyleSheet.create({
    text: {
        fontWeight: 'bold',
        fontSize: 24,
        color: '#1D4289',
        fontFamily: 'Arial',
        textAlign: 'center',
        marginTop: 20,
    },
});
