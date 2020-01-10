import React, { Component } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

const StyledButton = styled.TouchableOpacity`
    padding: 10.2px 12px 8.5px 12px;
    background-color: #12243f;
    border-radius: 2.5px;
    margin-right: 15px;
    justify-content: center;
    align-items: center;
`;

const StyledText = styled.Text`
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    padding-top: 1px;
    font-family: Poppins;
    font-weight: 400;
`;

class Button extends Component {
    render() {
        const { onPress, style, titleStyle, title } = this.props;
        return (
            <StyledButton
                onPress={onPress}
                style={style}
                hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}>
                <View style={{ flex: 1 }}>
                    <StyledText style={titleStyle}>
                        {title.toUpperCase()}
                    </StyledText>
                </View>
            </StyledButton>
        );
    }
}

export default Button;
