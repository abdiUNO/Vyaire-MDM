import React from 'react';

import {
    Animated,
    Dimensions,
    Easing,
    Platform,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    ViewPropTypes,
    I18nManager,
    TouchableOpacity,
    Modal,
} from 'react-native';
const STATES = {
    INIT: 'INIT',
    HIDDEN: 'HIDDEN',
    ANIMATING: 'ANIMATING',
    SHOWN: 'SHOWN',
};

const popoverPadding = 5;
const anchorSize = 20;
const anchorHyp = Math.sqrt(anchorSize * anchorSize + anchorSize * anchorSize);
const anchorOffset = (anchorHyp + anchorSize) / 2 - popoverPadding;

const EASING = Easing.bezier(0.4, 0, 0.2, 1);
const SCREEN_INDENT = 8;
const OFFSET = 0;
class Menu extends React.Component {
    _container = null;

    constructor(props) {
        super(props);

        this.state = {
            menuState: STATES.HIDDEN,

            init: true,

            top: 0,
            left: -150,

            menuWidth: 0,
            menuHeight: 0,

            buttonWidth: 0,
            buttonHeight: 0,

            opacity: 0,

            menuSizeAnimation: new Animated.ValueXY({ x: 0, y: 0 }),
            opacityAnimation: new Animated.Value(0),
        };
    }

    _setContainerRef = ref => {
        this._container = ref;
    };

    // Start menu animation
    _onMenuLayout = e => {
        if (
            this.state.menuState === STATES.ANIMATING ||
            this.state.init !== true
        ) {
            return;
        }

        const { width, height } = e.nativeEvent.layout;

        this.setState(
            {
                menuState: STATES.ANIMATING,
                menuWidth: width,
                menuHeight: height,
            },
            () => {
                Animated.parallel([
                    Animated.timing(this.state.menuSizeAnimation, {
                        toValue: { x: width, y: height },
                        duration: 300,
                        easing: EASING,
                    }),
                    Animated.timing(this.state.opacityAnimation, {
                        toValue: 1,
                        duration: 300,
                        easing: EASING,
                    }),
                ]).start();
            }
        );
    };

    _onDismiss = () => {
        if (this.props.onHidden) {
            this.props.onHidden();
        }
    };

    show = () => {
        this._container.measureInWindow(
            (left, top, buttonWidth, buttonHeight) => {
                Animated.timing(this.state.opacityAnimation, {
                    toValue: 1,
                    duration: 150,
                    easing: EASING,
                }).start(() => {
                    // Reset state
                    this.setState({
                        zIndex: 1,
                        init: false,
                        buttonHeight,
                        buttonWidth,
                        left: -100,
                        menuState: STATES.SHOWN,
                        top: 5,
                        opacityAnimation: new Animated.Value(1),
                    });
                });
            }
        );
    };

    hide = onHidden => {
        Animated.timing(this.state.opacityAnimation, {
            toValue: 0,
            duration: 300,
            easing: EASING,
        }).start(() => {
            // Reset state
            this.setState({
                zIndex: -5,
                menuState: STATES.HIDDEN,
                menuSizeAnimation: new Animated.ValueXY({ x: 0, y: 0 }),
                opacityAnimation: new Animated.Value(0),
            });
        });
    };

    // @@ TODO: Rework this
    _hide = () => {
        this.hide();
    };

    render() {
        const { isRTL } = I18nManager;

        const dimensions = Dimensions.get('window');
        const { width: windowWidth } = dimensions;
        const windowHeight = dimensions.height - (StatusBar.currentHeight || 0);

        const {
            menuSizeAnimation,
            menuWidth,
            menuHeight,
            buttonWidth,
            buttonHeight,
            opacityAnimation,
        } = this.state;
        const menuSize = {
            width: menuSizeAnimation.x,
            height: menuSizeAnimation.y,
        };

        // Adjust position of menu
        let { left, top, zIndex } = this.state;
        const transforms = [];

        // Flip by Y axis if menu hits bottom screen border
        if (top > windowHeight - menuHeight - SCREEN_INDENT) {
            transforms.push({
                translateY: Animated.multiply(menuSizeAnimation.y, -1),
            });

            top = windowHeight - SCREEN_INDENT;
            top = Math.min(windowHeight - SCREEN_INDENT, top + buttonHeight);
        } else if (top < SCREEN_INDENT) {
            top = SCREEN_INDENT;
        }

        const shadowMenuContainerStyle = {
            zIndex,
            opacity: opacityAnimation,
            transform: transforms,
            top,
            left,
        };

        const { menuState } = this.state;
        const animationStarted = menuState === STATES.ANIMATING;
        const modalVisible = menuState === STATES.SHOWN || animationStarted;

        const { testID, button, style, children } = this.props;

        return (
            <View
                ref={this._setContainerRef}
                collapsable={false}
                testID={testID}>
                <View>{button}</View>

                {menuState != STATES.HIDDEN && (
                    <Modal
                        visible={this.state.init !== true && modalVisible}
                        onRequestClose={this._hide}
                        supportedOrientations={[
                            'portrait',
                            'portrait-upside-down',
                            'landscape',
                            'landscape-left',
                            'landscape-right',
                        ]}
                        transparent
                        style={{ borderColor: '#FFFFFF' }}
                        onDismiss={this._onDismiss}>
                        <TouchableWithoutFeedback
                            disabled={true}
                            onPress={this._hide}
                            accessible={false}>
                            <View style={StyleSheet.absoluteFill}>
                                <Animated.View
                                    onLayout={this._onMenuLayout}
                                    style={[
                                        styles.shadowMenuContainer,
                                        shadowMenuContainerStyle,
                                        style,
                                    ]}>
                                    <Animated.View
                                        style={[
                                            styles.menuContainer,
                                            animationStarted && menuSize,
                                        ]}>
                                        {children}
                                    </Animated.View>
                                </Animated.View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                )}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    shadowMenuContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 4,
        opacity: 0,

        // Shadow
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.24,
        shadowRadius: 2,
        elevation: 5,
    },
    menuContainer: {
        overflow: 'hidden',
    },
    anchorStyle: {
        width: anchorSize,
        height: anchorSize,
        backgroundColor: '#FFFFFF',
        borderBottomEndRadius: 15,
    },
});

export default Menu;
