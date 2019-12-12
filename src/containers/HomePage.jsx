import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { Container, Flex, Column } from '../components/common';
import { Link } from 'react-router-dom';
const HomePage = () => {
    return (
        <Container fullVertical>
            <Flex justifyAround alignCenter padding="0px 25px" fullHeight>
                <Column four padding="0px 15px 50px 15px">
                    <Link to={'/customer/new'}>
                        <View>
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
                                style={styles.text}>{`Customer\nMaster`}</Text>
                        </View>
                    </Link>
                </Column>

                <Column four padding="0px 15px 50px 15px">
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
                    <Text style={styles.text}>{`Material\nMaster`}</Text>
                </Column>

                <Column four padding="0px 15px 50px 15px">
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
                </Column>
            </Flex>
        </Container>
    );
};

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

export default HomePage;
