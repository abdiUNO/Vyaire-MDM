import React, { Component } from 'react';
import { Animated } from 'react-native';

export default function({
    // bounce on mount?
    animateOnMount = true,
    // will be called in componentDidUpdate
    // return a bool to control whether animation fires
    shouldAnimate = nextProps => true,
    // scale to 1.5x the normal size
    startScale = 0,
    // bounce back to the normal size
    endScale = 1,
    // super bouncy
    friction = 1,
}) {
    const SpringAnimation = ComposedComponent =>
        class SpringAnimationHOC extends Component {
            state = {
                bounceValue: new Animated.Value(startScale),
            };

            render() {
                const { bounceValue } = this.state;
                return (
                    <ComposedComponent
                        style={{
                            transform: [
                                {
                                    translateY: bounceValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [200, 0],
                                    }),
                                },
                            ],
                            opacity: bounceValue,
                        }}
                        {...this.props}
                    />
                );
            }

            componentDidMount() {
                if (animateOnMount) this._animate();
            }

            componentDidUpdate(...args) {
                if (shouldAnimate.call(this, ...args)) this._animate();
            }

            _animate() {
                this.state.bounceValue.setValue(startScale);
                Animated.spring(this.state.bounceValue, {
                    toValue: endScale,
                    friction,
                }).start();
            }
        };

    return SpringAnimation;
}
