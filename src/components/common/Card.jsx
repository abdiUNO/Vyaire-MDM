import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = ({ children }) => <View style={styles.container}>{children}</View>;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 25,
        paddingHorizontal: 25,
    },
});

export default Card;
