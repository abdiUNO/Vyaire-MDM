import React, { useState } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import VyaireLogo from './VyaireLogo';
import Flex from './common/Flex';
import { Link } from 'react-router-dom';

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

export default function Header({ onMenuIconPress, width }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onMenuIconPress}>
                <Feather
                    name="menu"
                    size={38}
                    color="#11307D"
                    style={styles.menuIcon}
                />
            </TouchableOpacity>

            <Flex
                style={styles.logoContainer}
                alignCenter
                padding="12px 0px 0px">
                <VyaireLogo width={100} />
                <Text style={styles.mdmText}>MDM</Text>
            </Flex>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                }}>
                <NavLink href="/my-tasks">My Task</NavLink>
                <NavLink href="/my-requests">My Requests</NavLink>
                <NavLink href="/notifications">Notifications</NavLink>

                <View>
                    <Image
                        source={require('../../assets/icons/user.png')}
                        style={styles.userIcon}
                    />
                </View>
            </View>
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
        borderBottomColor: '#cfcfcf',
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
        fontWeight: 400,
        marginLeft: 5,
        paddingBottom: 15,
        color: '#05A5DE',
    },
    navLinkText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#1D4289',
        fontFamily: 'Arial',
    },
});
