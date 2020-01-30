import React, { useCallback } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    PixelRatio,
    Animated,
    Easing,
} from 'react-native';

import { Link } from 'react-router-dom';

import {
    DimensionAware,
    getWindowWidth,
    getWindowHeight,
} from 'react-native-dimension-aware';
import { TouchableWithoutFeedback } from 'react-native-web';
import useAnimation from './useAnimation';
import { MenuContext } from '../Root';

const { timing } = Animated;

const MenuItem = ({ children, href }) => (
    <View style={styles.menuItem}>
        <Link to={href}>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                }}>
                <Image
                    resizeMode="contain"
                    style={{
                        flex: 1,
                        flexBasis: 'auto',
                        width: 10,
                        height: 15,
                        marginRight: 9,
                    }}
                    source={require('../../assets/icons/arrow@2x.png')}
                />
                <Text style={styles.menuItemText}>{children}</Text>
            </View>
        </Link>
    </View>
);

const SubMenu = ({ children, title }) => (
    <>
        <View style={styles.menuHeaderContainer}>
            <Text
                style={[
                    styles.menuItemText,
                    styles.bold,
                    styles.menuItemsHeader,
                ]}>
                {title}
            </Text>
        </View>
        {children}
    </>
);

export function MenuContent({ width, height, isToggled, toggleMenu }) {
    return (
        <TouchableWithoutFeedback
            onPress={() => toggleMenu(false)}
            style={{ cursor: 'none' }}
            pointerEvents={!isToggled ? 'none' : 'box-none'}>
            <View
                style={[styles.overlay, { width: width }]}
                pointerEvents={!isToggled ? 'none' : 'box-none'}>
                <View style={{ height: '100vh' }}>
                    <View
                        style={[
                            styles.menuContainer,
                            width <= 892 && {
                                zIndex: -1,
                                position: 'absolute',
                                width: 245,
                            },
                        ]}>
                        <ScrollView
                            style={{
                                flex: 1,
                            }}
                            keyboardShouldPersistTaps="always">
                            <SubMenu title="KPI">
                                <MenuItem href="/customer/new">
                                    Dashboard
                                </MenuItem>
                                <MenuItem href="/customer/update">
                                    Reports
                                </MenuItem>
                                <MenuItem href="/customer/decommission">
                                    Report Catalogues
                                </MenuItem>
                            </SubMenu>

                            <SubMenu title="DATA GOVERANCE">
                                <MenuItem href="/material/new">
                                    Council
                                </MenuItem>
                                <MenuItem href="/material/update">
                                    Policies
                                </MenuItem>
                                <MenuItem href="/material/decommission">
                                    Standards
                                </MenuItem>
                            </SubMenu>

                            <SubMenu title="HELP">
                                <MenuItem href="/metrics/customer-master">
                                    Connect It
                                </MenuItem>
                                <MenuItem href="/metrics/material-master">
                                    Training Manual
                                </MenuItem>
                                <View
                                    style={[
                                        styles.menuItem,
                                        { borderBottomWidth: 0 },
                                    ]}>
                                    <Link to={'/'}>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}>
                                            <Image
                                                resizeMode="contain"
                                                style={{
                                                    flex: 1,
                                                    flexBasis: 'auto',
                                                    width: 10,
                                                    height: 15,
                                                    marginRight: 9,
                                                }}
                                                source={require('../../assets/icons/arrow@2x.png')}
                                            />
                                            <Text style={styles.menuItemText}>
                                                Contact Us
                                            </Text>
                                        </View>
                                    </Link>
                                </View>
                            </SubMenu>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const AnimatedComponent = ({ doAnimation, children }) => {
    const animation = useAnimation({
        doAnimation,
        duration: 150,
        easing: Easing.ease,
        type: 'timing',
    });
    return (
        <Animated.View
            pointerEvents={doAnimation ? 'auto' : 'none'}
            style={{
                zIndex: 3,
                position: 'absolute',
                transform: [
                    {
                        translateX: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-200, 0],
                        }),
                    },
                ],
                opacity: animation,
            }}>
            {children}
        </Animated.View>
    );
};

class Menu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MenuContext.Consumer>
                {({ isToggled, toggleMenu }) => {
                    return (
                        <AnimatedComponent doAnimation={isToggled}>
                            <DimensionAware
                                render={dimensions => (
                                    <MenuContent
                                        {...{
                                            ...this.props,
                                            toggleMenu,
                                            width: getWindowWidth(dimensions),
                                            height: getWindowHeight(dimensions),
                                        }}
                                    />
                                )}
                            />
                        </AnimatedComponent>
                    );
                }}
            </MenuContext.Consumer>
        );
    }
}

export default Menu;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    }

    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
}

const styles = StyleSheet.create({
    bold: { color: '#10254D', fontFamily: 'Poppins', fontWeight: '700' },
    logoContainer: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#cfcfcf',
        borderBottomWidth: 1,
    },
    overlay: {
        zIndex: 1,
        height: '100vh',
    },
    menuContainer: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        width: 300,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#CCE7F2',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        paddingBottom: 16,
        paddingRight: 15,
        marginTop: 16,
        marginHorizontal: 32,
    },
    menuItemText: {
        fontSize: 16,
        color: '#10254D',
        fontFamily: 'Poppins',
        fontWeight: '400',
    },
    menuHeaderContainer: {
        paddingLeft: 32,
        backgroundColor: '#D0E8F2',
        paddingVertical: 12,
    },
    menuItemsHeader: {
        color: '#10254D',
        fontFamily: 'Poppins',
        fontSize: 17,
    },
    menuItemIcon: {
        width: 35,
        height: 35,
        paddingRight: 5,
    },
    selectedStreamListItem: {
        borderLeftColor: '#6ED2F6',
        borderLeftWidth: 3,
        borderRadius: 2,
    },
    selectedStreamListItemText: {
        color: '#E57230',
    },
});
