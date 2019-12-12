import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = ({ children, style }) => (
    <View style={[styles.container, style]}>{children}</View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingVertical: 25,
        paddingHorizontal: 25,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        borderRadius: 5,
    },
});

export default Card;
