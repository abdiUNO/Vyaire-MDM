import React, { Component } from 'react';
import styled from 'styled-components';
import { Animated, Easing, View } from 'react-native';
import { Box, Text } from './common';
import { pick } from '@styled-system/props';
import useAnimation from './useAnimation';

const AnimatedComponent = ({
    doAnimation,
    onAnimationEnd,
    children,
    config,
    transition,
}) => {
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
                zIndex: 3,
                position: 'absolute',
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
};

const Message = styled(View)`
    padding: 10px 15px;
    border-radius: 3px;
    margin-bottom: 5px;
    color: #fff;
    font-size: 14px;
    background: #28a745;
`;

class FlashMessage extends Component {
    state = {
        animate: true,
        hide: false,
    };

    render() {
        const { message, ...rest } = this.props;
        const wrapperProps = pick(rest);

        return !this.state.hide ? (
            <AnimatedComponent
                config={{
                    delay: 100,
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
                            3000
                        );
                    else this.setState({ hide: true });
                }}>
                <Box
                    top="5px"
                    right="5px"
                    style={{ zIndex: 99 }}
                    {...wrapperProps}
                    p="0px 45px 0px 45px">
                    <Message>
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

export default FlashMessage;
