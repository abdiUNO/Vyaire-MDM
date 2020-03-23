import React, { useState } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link, useLocation } from '../../navigation/router';
import VyaireLogo from '../VyaireLogo';
import Flex from '../common/Flex';
import { Colors } from '../../theme/';
import NavLink from './NavLink';
import PopUpMenu from '../PopUpMenu';
import MenuItem from '../MenuItem';
import MenuDivider from '../MenuDivider';

class DropDownMenu extends React.Component {
    _menu = null;

    constructor(props) {
        super(props);
        this.state = {
            showing: false,
        };
    }

    setMenuRef = ref => {
        this._menu = ref;
        this._menu.hide();
    };

    hideMenu = () => {
        this._menu.hide();
    };
    onLogout = () => {
        this.hideMenu();
        this.props.onLogout();
    };

    showMenu = () => {
        if (this.state.showing === true) {
            this._menu.hide();
        } else {
            this._menu.show();
        }

        this.setState({ showing: !this.state.showing });
    };

    render() {
        return (
            <View style={styles.dropDownMainContainer}>
                <PopUpMenu
                    onHidden={() => this.setState({ showing: false })}
                    ref={this.setMenuRef}
                    button={
                        <TouchableOpacity onPress={this.showMenu}>
                            <Image
                                source={require('../../../assets/icons/user.png')}
                                style={styles.userIcon}
                            />
                        </TouchableOpacity>
                    }>
                    <MenuItem onPress={this.hideMenu}>
                        <View style={styles.settingsView}>
                            <Text style={styles.settingViewText}>
                                {this.props.currentUser.username}
                            </Text>
                        </View>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={this.onLogout}>
                        <View style={styles.settingsView}>
                            <Feather
                                style={styles.featherStyle}
                                name="log-out"
                                size={13}
                                color="#1e272e"
                            />
                            <Text style={styles.logoutText}>Logout</Text>
                        </View>
                    </MenuItem>
                </PopUpMenu>
            </View>
        );
    }
}

export default function Header({ onMenuIconPress, currentUser, onLogout }) {
    const location = useLocation();
    return (
        <View style={styles.container}>
            <Flex alignCenter>
                <TouchableOpacity onPress={onMenuIconPress}>
                    <Feather
                        name="menu"
                        size={38}
                        color="#11307D"
                        style={styles.menuIcon}
                    />
                </TouchableOpacity>

                <Link to={'/'}>
                    <Flex
                        style={styles.logoContainer}
                        alignCenter
                        padding="12px 0px 0px">
                        <View>
                            <Image
                                resizeMode="contain"
                                style={{
                                    flex: 1,
                                    flexBasis: 'auto',
                                    width: '100%',
                                    height: 14,
                                    opacity: 0.75,
                                    position: 'relative',
                                }}
                                source={require('../../../assets/icons/wisp.svg')}
                            />
                            <VyaireLogo width={100} />
                        </View>
                        <Text style={styles.mdmText}>MDM</Text>
                    </Flex>
                </Link>
            </Flex>
            <Flex justifyStart alignCenter>
                {location.pathname !== '/' && (
                    <View
                        style={{
                            marginRight: 50,
                            flex: 1,
                            flexDirection: 'row',
                        }}>
                        <NavLink href="/my-tasks">MY TASK</NavLink>
                        <NavLink href="/my-requests">MY REQUESTS</NavLink>
                    </View>
                )}

                <View>
                    <Link to="/advance-search">
                        <Image
                            source={require('../../../assets/search.png')}
                            style={styles.searchIcon}
                        />
                    </Link>
                </View>

                {/*<DropDownMenu currentUser={currentUser} onLogout={onLogout} />*/}
            </Flex>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 100,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: Colors.white,
        flexWrap: 'wrap',
        borderBottomColor: Colors.silver,
        borderBottomWidth: 1,
        shadowColor: Colors.dark,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 4,

        elevation: 4,
    },
    logoContainer: {
        paddingTop: 5,
    },
    userIcon: {
        width: 58,
        height: 58,
        marginTop: 5,
        marginRight: 5,
        backgroundColor: Colors.white,
    },
    searchIcon: {
        width: 22.5,
        height: 22.5,
        marginTop: 5,
        marginRight: 15,
        backgroundColor: Colors.white,
    },
    menuIcon: {
        marginHorizontal: 25,
    },

    gearIcon: {
        width: 43,
        height: 43,
        marginTop: 2.5,
        marginRight: 5,
        backgroundColor: '#FFFFFF',
    },

    mdmText: {
        fontSize: 34,
        fontWeight: '400',
        marginLeft: 5,
        paddingBottom: 5,
        color: Colors.lightBlue,
    },
    settingsView: {
        flex: 1,
        flexBasis: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 150,
    },
    settingViewText: {
        color: '#1D4289',
        fontWeight: 'bold',
    },
    dropDownMainContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    featherStyle: {
        marginLeft: 8,
        marginRight: 15,
        borderRadius: 25,
        borderColor: 'grey',
        borderWidth: 1,
        padding: 5,
    },
    logoutView: {
        flex: 1,
        flexBasis: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutText: {
        color: '#e74c3c',
    },
});
