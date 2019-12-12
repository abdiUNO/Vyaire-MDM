import { View } from 'react-native';
import React from 'react';

const Card = ({ children }) => (
    <View
        style={{
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
        }}>
        {children}
    </View>
);

export default Card;
