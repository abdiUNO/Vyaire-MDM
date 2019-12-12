import React from 'react';
import { Link } from 'react-router-dom';
import { StyleSheet, Text } from 'react-native';

export default function({ href, style = {}, textStyle = {}, children }) {
    return (
        <>
            {href ? (
                <Link to={href} style={[styles.linkWrapper, style]}>
                    <Text style={[styles.linkText, textStyle]}>{children}</Text>
                </Link>
            ) : (
                <Text style={[styles.linkText, textStyle]}>{children}</Text>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    linkText: {
        fontSize: 16,
        color: '#1D4289',
        fontFamily: 'Arial',
        fontWeight: 'normal',
    },
    linkWrapper: {
        textDecoration: 'none',
    },
});
