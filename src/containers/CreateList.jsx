import React, { Component, useState } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
    Animated,
    Easing,
    TouchableOpacity,
} from 'react-native';
import { Container, Flex, Column, Button } from '../components/common';
import CheckMark from '../components/CheckMark';

const { stagger, spring } = Animated;

const Card = ({ style, icon, text, isToggled, toggle }) => {
    return (
        <TouchableOpacity
            onPress={() => toggle(!isToggled)}
            style={{
                paddingHorizontal: 45,
            }}>
            <Animated.View
                style={[
                    isToggled
                        ? {
                              borderColor: '#67aad2',
                              paddingHorizontal: 32,
                              borderWidth: 1,
                              borderRadius: 10,
                              minWidth: 150,
                              minHeight: 150,
                              backgroundColor: '#A4D3E7',
                          }
                        : styles.shadow,
                    styles.box,
                    style,
                ]}>
                {isToggled && (
                    <View
                        style={{
                            position: 'absolute',
                            fontWeight: '600',
                            left: -15,
                            top: -15,
                            backgroundColor: '#000',
                            borderRadius: 25,
                        }}>
                        <CheckMark />
                    </View>
                )}
                <Image
                    resizeMode="contain"
                    style={{
                        flex: 1,
                        marginTop: 30,
                        marginLeft: 2,
                        flexBasis: 'auto',
                        width: 80,
                        height: 60,
                    }}
                    source={icon}
                />
                <Text style={styles.text}>{text}</Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

class CreateList extends Component {
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
            isToggled: null,
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

    toggleCard = role => {
        this.setState({ isToggled: role });
    };

    componentDidMount() {
        this.anim.start();
    }

    onNext = () => {
        const { location } = this.props;
        let { state } = location;
        const roles = {
            'ship-to': '2',
            payer: '3',
            'bill-to': '4',
        };

        state.RoleTypeId = roles[this.state.role];

        this.props.history.push({
            pathname: '/customers/create',
            state,
        });
    };

    render() {
        const { isToggled } = this.state;
        return (
            <View
                style={{
                    backgroundColor: '#fff',
                    paddingTop: 40,
                    paddingBottom: 75,
                }}>
                <Container
                    fullVertical
                    style={{
                        justifyContent: 'center',
                        alignContent: 'center',
                        height: '75vh',
                    }}>
                    <Flex
                        justifyAround
                        alignCenter
                        padding="0px 0px 40px 0px"
                        style={styles.headerContainer}>
                        <Text style={styles.topText}>
                            Would you like to also create a:
                        </Text>
                    </Flex>

                    <Flex justifyAround alignCenter padding="0px 75px">
                        <Column four padding="30px 0px 0px 0px">
                            <Card
                                pointerEvents={'box-none'}
                                isToggled={isToggled === 'ship-to'}
                                toggle={() => this.toggleCard('ship-to')}
                                style={[
                                    {
                                        transform: [
                                            {
                                                translateY: this.state
                                                    .animVals[0].posY,
                                            },
                                        ],
                                        opacity: this.state.animVals[0].opacity,
                                    },
                                ]}
                                icon={require('../../assets/icons/car@2x.png')}
                                text="Ship To"
                            />
                        </Column>

                        <Column four padding="30px 0px 0px 0px">
                            <Card
                                pointerEvents={'box-none'}
                                isToggled={isToggled === 'bill-to'}
                                toggle={() => this.toggleCard('bill-to')}
                                style={[
                                    {
                                        transform: [
                                            {
                                                translateY: this.state
                                                    .animVals[0].posY,
                                            },
                                        ],
                                        opacity: this.state.animVals[0].opacity,
                                    },
                                ]}
                                icon={require('../../assets/icons/bill_to@2x.png')}
                                text="Bill To"
                            />
                        </Column>

                        <Column four padding="30px 0px 0px 0px">
                            <Card
                                isToggled={isToggled === 'payer'}
                                toggle={() => this.toggleCard('payer')}
                                style={[
                                    {
                                        transform: [
                                            {
                                                translateY: this.state
                                                    .animVals[0].posY,
                                            },
                                        ],
                                        opacity: this.state.animVals[0].opacity,
                                    },
                                ]}
                                icon={require('../../assets/icons/payer@2x.png')}
                                text="Payer"
                            />
                        </Column>
                    </Flex>
                    <Flex
                        justifyAround
                        alignCenter
                        padding="100px 0px 0px 0px"
                        style={styles.headerContainer}>
                        <Text style={styles.bottomText}>
                            Please select one or skip to submit your request.
                        </Text>
                    </Flex>

                    <Flex
                        justifyCenter
                        alignCenter
                        style={styles.headerContainer}>
                        <Button title="Next" onPress={this.onNext} />
                        <Button
                            onPress={() => this.props.history.push('/')}
                            title="Skip"
                        />
                    </Flex>
                </Container>
            </View>
        );
    }
}

export default CreateList;

const styles = StyleSheet.create({
    text: {
        fontWeight: 'medium',
        marginBottom: 15,
        fontSize: 16,
        color: '#4195C7',
        fontFamily: 'Poppins',
        textAlign: 'center',
        marginTop: 20,
    },
    topText: {
        fontSize: 22,
        fontWeight: '500',
        paddingVertical: 5,
        paddingHorizontal: 25,
        color: '#264384',
        fontFamily: 'Poppins',
    },
    bottomText: {
        fontSize: 22,
        fontWeight: '500',
        paddingVertical: 5,
        paddingHorizontal: 25,
        color: '#264384',
        fontFamily: 'Poppins',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 15,
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: 25,
    },
    shadow: {
        borderColor: '#67aad2',
        paddingHorizontal: 32,
        minWidth: 150,
        minHeight: 150,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 4,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#DAECF2',
    },
    box: {},
});
