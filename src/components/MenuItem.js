import React from 'react';

import {
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

const Touchable = Platform.select({
    android: TouchableNativeFeedback,
    default: TouchableHighlight,
});

const MenuItem = props => {
    const touchableProps =
        Platform.OS === 'android'
            ? { background: TouchableNativeFeedback.SelectableBackground() }
            : {};

    const { children, disabled, onPress, style } = props;
    const disabledTextColor = '#bdbdbd';

    return (
        <TouchableWithoutFeedback
            disabled={disabled}
            onPress={onPress}
            {...touchableProps}
            {...props}>
            <View style={[styles.container, style]}>{children}</View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 48,
        justifyContent: 'center',
        maxWidth: 248,
        minWidth: 124,
        paddingHorizontal: 4,
        paddingLeft: 16,
        marginRight: 5,
        textAlign: 'left',
    },
    title: {
        fontSize: 14,
        fontWeight: '400',
    },
});

export default MenuItem;
