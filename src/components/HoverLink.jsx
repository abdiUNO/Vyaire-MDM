import React, { useRef } from 'react';
import { StyleSheet, Linking, Text, Platform } from 'react-native';

import { useHover, useFocus, useActive } from 'react-native-web-hooks';
function HoverLink({ children, href = '#', styles }) {
    // Create a ref to bind the hooks to
    const ref = useRef(null);
    // Pass that ref to the hooks...
    const { isHovered } = useHover(ref);
    const { isFocused } = useFocus(ref);
    const { isActive } = useActive(ref);

    return (
        <Text
            accessibilityRole="link"
            href={href}
            draggable={false}
            onPress={() => Linking.openURL(href)}
            tabIndex={0}
            ref={ref}
            style={[
                styles,
                // When these booleans become true, the following styles will be applied...
                isHovered && { color: 'blue' },
                isFocused && { color: 'green' },
                isActive && { color: 'red' },
            ]}>
            {children}
        </Text>
    );
}

export default HoverLink;
