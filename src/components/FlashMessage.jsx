import React, { Component } from 'react';
import styled from 'styled-components';
import { Animated, Easing, View } from 'react-native';
import { Box, Text } from './common';
import { pick } from '@styled-system/props';
import useAnimation from './useAnimation';

function AnimatedComponent({
    doAnimation,
    onAnimationEnd,
    children,
    config,
    transition,
    innerRef,
}) {
    const animation = useAnimation({
        doAnimation,
        delay: config.delay,
        duration: config.duration,
        easing: Easing.out(),
        onEnd: onAnimationEnd,
        type: 'spring',
    });
    return (
        <Animated.View
            pointerEvents={doAnimation ? 'auto' : 'none'}
            style={{
                position: 'fixed',
                top: 25,
                right: 0,
                transform: [
                    {
                        [config.property]: animation.interpolate(transition),
                    },
                ],
                opacity: animation,
            }}>
            {children}
        </Animated.View>
    );
}

const Message = styled(View)`
    padding: 10px 15px;
    border-radius: 3px;
    margin-bottom: 5px;
    color: #fff;
    font-size: 14px;
`;

class FlashMessage extends Component {
    state = {
        animate: true,
        hide: false,
    };

    render() {
        const { bg, message, onDismiss, ...rest } = this.props;
        const wrapperProps = pick(rest);

        return !this.state.hide ? (
            <AnimatedComponent
                config={{
                    delay: 200,
                    duration: 200,
                    property: 'translateY',
                }}
                transition={{
                    inputRange: [0, 1],
                    outputRange: [this.state.animate ? 100 : 50, 0],
                }}
                doAnimation={this.state.animate}
                onAnimationEnd={() => {
                    if (this.state.animate)
                        setTimeout(
                            () => this.setState({ animate: false }),
                            2000
                        );
                    else
                        this.setState({ hide: true }, () => {
                            if (onDismiss) onDismiss();
                        });
                }}>
                <Box
                    top="5px"
                    right="5px"
                    style={{ zIndex: 99 }}
                    {...wrapperProps}
                    p="0px 45px 0px 45px">
                    <Message style={bg}>
                        <Text
                            color="#FFFFFF"
                            fontSize="14px"
                            fontFamily="Poppins"
                            px="15px">
                            {message}
                        </Text>
                    </Message>
                </Box>
            </AnimatedComponent>
        ) : null;
    }
}

export const FlashMessages = ({ toasts = [], onDismiss }) => {
    if (toasts.length <= 0) return null;

    const { id, msg, color } = toasts[0];
    return (
        <FlashMessage
            bg={{
                backgroundColor: color || '#FFF',
            }}
            message={msg}
            key={id}
            onDismiss={() => onDismiss(msg)}
            marginTop={'150px'}
        />
    );
};
// export class FlashMsgQue extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             messages: [],
//         };
//     }
//     render() {
//         const {messages } =
//         return this.updateCellsBatchingPeriod;
//     }
// }

export default FlashMessage;
