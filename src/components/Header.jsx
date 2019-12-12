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
import { Link, useLocation } from '../navigation';
import VyaireLogo from './VyaireLogo';
import Flex from './common/Flex';

const NavLink = ({ children, href }) => (
    <Flex alignCenter margin="0px 25px" padding="15px 0px 0px 0px">
        {href ? (
            <Link to={href}>
                <Text style={styles.navLinkText}>{children}</Text>
            </Link>
        ) : (
            <Text style={styles.navLinkText}>{children}</Text>
        )}
    </Flex>
);

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
                                source={require('../../assets/icons/wisp.svg')}
                            />
                            <VyaireLogo width={100} />
                        </View>
                        <Text style={styles.mdmText}>MDM</Text>
                    </Flex>
                </Link>
            </Flex>
            <Flex justifyStart alignCenter>
                {location.pathname !== '/' && (
                    <>
                        <NavLink href="/my-tasks">My Task</NavLink>
                        <NavLink href="/my-requests">My Requests</NavLink>
                        <NavLink href="/notifications">Notifications</NavLink>
                    </>
                )}

                <View>
                    <Image
                        source={require('../../assets/icons/user.png')}
                        style={styles.userIcon}
                    />
                </View>
            </Flex>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 90,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        flexWrap: 'wrap',
        borderBottomColor: '#c8c8c8',
        borderBottomWidth: 1,
    },
    logoContainer: {
        paddingTop: 5,
    },
    userIcon: {
        width: 58,
        height: 58,
        marginTop: 5,
        marginRight: 5,
        backgroundColor: '#FFFFFF',
    },
    menuIcon: {
        marginHorizontal: 25,
    },
    mdmText: {
        fontSize: 34,
        fontWeight: '400',
        marginLeft: 5,
        paddingBottom: 5,
        color: '#05A5DE',
    },
    wispIcon: {
        flex: 1,
        flexBasis: 'auto',
        width: '100%',
        height: 14,
        opacity: 0.75,
        position: 'relative',
    },
    navLinkText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#1D4289',
        fontFamily: 'Arial',
    },
});
