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
} from 'react-native';

import { Link } from 'react-router-dom';

import {
    DimensionAware,
    getWindowWidth,
    getWindowHeight,
} from 'react-native-dimension-aware';
import VyaireLogo from './VyaireLogo';

const MenuItem = ({ children, href }) => (
    <View style={[styles.menuItem]}>
        {href ? (
            <Link to={href}>
                <Text style={[styles.menuItemText]}>{children}</Text>
            </Link>
        ) : (
            <Text style={[styles.menuItemText]}>{children}</Text>
        )}
    </View>
);

const SubMenu = ({ children, title }) => (
    <>
        <View style={[styles.menuItem, styles.menuHeaderContainer]}>
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

export function MenuContent({ width, height }) {
    return (
        <View style={[styles.overlay]}>
            <View
                style={[
                    styles.menuContainer,
                    width <= 892 && {
                        zIndex: -1,
                        position: 'absolute',
                        width: 245,
                    },
                ]}>
                <ScrollView style={{ flex: 1 }}>
                    <View
                        style={[
                            styles.logoContainer,
                            width <= 892 && {
                                paddingLeft: 0,
                                paddingVertical: 0,
                            },
                        ]}>
                        <VyaireLogo
                            width={width <= 892 ? 75 : 125}
                            viewBox={width <= 892 ? '0 0 165 35' : '0 0 165 44'}
                        />
                        <Text
                            style={{
                                fontSize: 40,
                                marginLeft: 5,
                                paddingBottom: 10,
                                color: '#05A5DE',
                            }}>
                            MDM
                        </Text>
                    </View>

                    <SubMenu title="Customer Master Data Setup">
                        <MenuItem href="/customer/new">New</MenuItem>
                        <MenuItem href="/customer/update">Update</MenuItem>
                        <MenuItem href="/customer/decommission">
                            Decommission
                        </MenuItem>
                    </SubMenu>

                    <SubMenu title="Material Master Data Setup">
                        <MenuItem href="/material/new">New</MenuItem>
                        <MenuItem href="/material/update">Update</MenuItem>
                        <MenuItem href="/material/decommission">
                            Decommission
                        </MenuItem>
                    </SubMenu>

                    <SubMenu title="Metrics">
                        <MenuItem href="/metrics/customer-master">
                            Customer Master
                        </MenuItem>
                        <MenuItem href="/metrics/material-master">
                            Material Master
                        </MenuItem>
                    </SubMenu>

                    <SubMenu title="Administration">
                        <MenuItem href="/administration/data-stewardship">
                            Data Stewardship
                        </MenuItem>
                        <MenuItem href="/administration/security">
                            Security
                        </MenuItem>
                        <MenuItem href="/administration/configuration">
                            Configuration
                        </MenuItem>
                    </SubMenu>
                </ScrollView>
            </View>
        </View>
    );
}

const Menu = props => (
    <DimensionAware
        render={dimensions => (
            <MenuContent
                {...{
                    ...props,
                    width: getWindowWidth(dimensions),
                    height: getWindowHeight(dimensions),
                }}
            />
        )}
    />
);

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
    bold: { fontWeight: 'bold' },
    logoContainer: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#cfcfcf',
        borderBottomWidth: 1,
    },
    overlay: {
        zIndex: 1,
    },
    menuContainer: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        width: 275,
        paddingTop: 12,
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
        paddingLeft: 10,
        paddingRight: 15,
        marginVertical: 6,
        marginHorizontal: 10,
    },
    menuItemText: {
        fontSize: 16,
        color: '#1D4289',
        fontFamily: 'Arial',
        fontWeight: 'normal',
    },
    menuHeaderContainer: {
        marginTop: 25,
        marginBottom: 10,
        marginHorizontal: 5,
    },
    menuItemsHeader: {
        backgroundColor: '#1D4289',
        color: '#FFFFFF',
        paddingVertical: 5,
        paddingHorizontal: 15,
        fontFamily: 'Arial',
        fontSize: 15,
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
