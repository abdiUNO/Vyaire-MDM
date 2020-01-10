import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import Flex from '../common/Flex';
import { Link } from '../../navigation/router';
import { Colors } from '../../theme';

const NavLink = ({ children, href }) => (
    <Flex alignCenter margin="0px 25px" padding="7px 0px 0px 0px">
        {href ? (
            <Link to={href}>
                <Text style={styles.navLinkText}>{children}</Text>
            </Link>
        ) : (
            <Text style={styles.navLinkText}>{children}</Text>
        )}
    </Flex>
);

const styles = StyleSheet.create({
    navLinkText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: Colors.darkBlue,
        fontFamily: 'Poppins',
    },
});

export default NavLink;
