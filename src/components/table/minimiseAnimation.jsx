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
import { Button, Box } from '../common';

import { Link } from 'react-router-dom';

import {
    DimensionAware,
    getWindowWidth,
    getWindowHeight,
} from 'react-native-dimension-aware';
import { TouchableWithoutFeedback } from 'react-native-web';
import useAnimation from '../useAnimation';
import { AntDesign } from '@expo/vector-icons';

const { timing } = Animated;

const Item = ({ children, href }) => (
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
                    source={require('../../../assets/icons/arrow@2x.png')}
                />
                <Text style={styles.menuItemText}>{children}</Text>
            </View>
        </Link>
    </View>
);

const CloseSlider = ({ children, title }) => (
    <>
       
        <View style={styles.menuHeaderContainer}>
            <AntDesign
                name="arrowright"
                size={38}
                color="#11307D"
                
            />
        </View>
        {children}
    </>
);

const TableHeading = ({ children, title }) => (
    <>
        <View style={styles.TableHeaderContainer}>
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
export function Content({ width, height, onMenuDismiss,content }) {
    return (        
                <Box  style={{ width:'100%'}}>                           
                    {content}
                </Box>
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
                width:'100%',
                zIndex: 3,
                position: 'absolute',
                transform: [
                    {
                        translateY: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0,0.5],
                        }),
                    },
                ],
                opacity: animation,
            }}>
            {children}
        </Animated.View>
    );
};

class MinimiseAnimation extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <AnimatedComponent doAnimation={this.props.isToggled}>
                <DimensionAware
                    render={dimensions => (
                        <Content
                            {...{
                                ...this.props,
                                width: getWindowWidth(dimensions),
                                height: getWindowHeight(dimensions),
                            }}
                        />
                    )}
                />
            </AnimatedComponent>
        );
    }
}

export default MinimiseAnimation;

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
    TableHeaderContainer: {
        paddingLeft: 32,
        backgroundColor: '#234385',
        paddingVertical: 12,
    },
    menuItemsHeader: {
        color: 'white',
        fontFamily: 'Poppins',
        fontSize: 17,
    },
});
