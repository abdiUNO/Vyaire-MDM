import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';

const { Value, timing } = Animated;

export default class Example extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.box,
                        { transform: [{ translateX: this._transX }] },
                    ]}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    box: {
        width: 50,
        height: 50,
        backgroundColor: 'purple',
        borderRadius: 5,
    },
});
