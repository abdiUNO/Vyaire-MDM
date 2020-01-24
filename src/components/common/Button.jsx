import React, { Component } from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import styled from 'styled-components/Native';
import { space, layout, flexbox } from 'styled-system';
import { pick } from '@styled-system/props';

const StyledButton = styled(TouchableOpacity)`
    padding: 10.2px 12px 8.5px 12px;
    background-color: #12243f;
    border-radius: 2.5px;
    margin-right: 15px;
    justify-content: center;
    align-items: center;
    ${space}
    ${layout}
    ${flexbox}
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

        const wrapperProps = {
            ...pick(this.props),
        };

        return (
            <StyledButton
                {...(Platform.OS === 'web'
                    ? {
                          // When scrolling the document body, the touchables might be triggered
                          // see  https://github.com/necolas/react-native-web/issues/1219
                          onClick: onPress,
                      }
                    : {
                          onPress: onPress,
                      })}
                style={style}
                {...wrapperProps}>
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
