import React, { useState } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link, useLocation } from '../../navigation/router';
import VyaireLogo from '../VyaireLogo';
import Flex from '../common/Flex';
import { Colors } from '../../theme/';
import NavLink from './NavLink';

export default function Header({ onMenuIconPress }) {
    const location = useLocation();
    return (
        <View style={styles.container}>
            <Flex alignCenter>
                <TouchableOpacity onPress={onMenuIconPress}>
                    <Feather
                        name="menu"
                        size={38}
                        color="#11307D"
                        style={styles.menuIcon}
                    />
                </TouchableOpacity>

                <Link to={'/'}>
                    <Flex
                        style={styles.logoContainer}
                        alignCenter
                        padding="12px 0px 0px">
                        <View>
                            <Image
                                resizeMode="contain"
                                style={{
                                    flex: 1,
                                    flexBasis: 'auto',
                                    width: '100%',
                                    height: 14,
                                    opacity: 0.75,
                                    position: 'relative',
                                }}
                                source={require('../../../assets/icons/wisp.svg')}
                            />
                            <VyaireLogo width={100} />
                        </View>
                        <Text style={styles.mdmText}>MDM</Text>
                    </Flex>
                </Link>
            </Flex>
            <Flex justifyStart alignCenter>
                {location.pathname !== '/' && (
                    <View
                        style={{
                            marginRight: 50,
                            flex: 1,
                            flexDirection: 'row',
                        }}>
                        <NavLink href="/my-tasks">MY TASK</NavLink>
                        <NavLink href="/my-requests">MY REQUESTS</NavLink>
                    </View>
                )}

                <View>
                    <Image
                        source={require('../../../assets/search.png')}
                        style={styles.searchIcon}
                    />
                </View>

                <View>
                    <Image
                        source={require('../../../assets/icons/user.png')}
                        style={styles.userIcon}
                    />
                </View>
            </Flex>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 100,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: Colors.white,
        flexWrap: 'wrap',
        borderBottomColor: Colors.silver,
        borderBottomWidth: 1,
        shadowColor: Colors.dark,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 4,

        elevation: 4,
    },
    logoContainer: {
        paddingTop: 5,
    },
    userIcon: {
        width: 58,
        height: 58,
        marginTop: 5,
        marginRight: 5,
        backgroundColor: Colors.white,
    },
    searchIcon: {
        width: 22.5,
        height: 22.5,
        marginTop: 5,
        marginRight: 15,
        backgroundColor: Colors.white,
    },
    menuIcon: {
        marginHorizontal: 25,
    },
    mdmText: {
        fontSize: 34,
        fontWeight: '400',
        marginLeft: 5,
        paddingBottom: 5,
        color: Colors.lightBlue,
    },
});
