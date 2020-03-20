import React, { Component } from 'react';
import { Auth, Cache } from 'aws-amplify';
import { Authenticator, withOAuth } from 'aws-amplify-react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    Text,
    View,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    AsyncStorage,
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import { Redirect } from 'react-router-dom';
import { Button, Box } from '../components/common';
import VyaireLogo from '../components/VyaireLogo';
import Flex from '../components/common/Flex';
import { Colors } from '../theme';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            customState: null,
        };

        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (err, stores) => {
                stores.map((result, i, store) => {
                    // get at each store's key/value so you can work with it
                    let key = store[i][0];
                    let value = store[i][1];
                });
            });
        });
    }

    handleStateChange = (state, data) => {
        console.log(state, data);
        if (state === 'signedIn') {
            this.props.onUserSignIn();
        }
    };

    render() {
        const { error } = this.props;

        const { user } = this.state;

        if (user) {
            return <Redirect to="/" />;
        }

        if (this.props.loading == true) {
            return (
                <View
                    style={{
                        flex: 1,
                        flexBasis: 'auto',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <ActivityIndicator />
                </View>
            );
        }

        return (
            <View
                style={{
                    flex: 1,
                    flexBasis: 'auto',
                    backgroundColor: '#f0f0f0',
                }}>
                <View
                    style={{
                        flex: 1,
                        flexBasis: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f0f0f0',
                        height: hp('100%'),
                        paddingHorizontal: 70,
                        paddingVertical: 40,
                    }}>
                    <Authenticator
                        hideDefault={true}
                        onStateChange={this.handleStateChange}>
                        <View
                            style={{
                                flex: 1,
                                flexBasis: 'auto',

                                shadowColor: '#000',
                                backgroundColor: '#f0f0f0',
                            }}>
                            <View style={styles.containerView}>
                                <View style={styles.loginScreenContainer}>
                                    <View style={styles.loginFormView}>
                                        <Flex
                                            style={styles.logoContainer}
                                            alignCenter>
                                            <View>
                                                <Image
                                                    resizeMode="contain"
                                                    style={{
                                                        flex: 1,
                                                        flexBasis: 'auto',
                                                        width: '100%',
                                                        height: 19,
                                                        marginBottom: 5,
                                                        opacity: 0.75,
                                                        position: 'relative',
                                                    }}
                                                    source={require('../../assets/icons/wisp.svg')}
                                                />
                                                <VyaireLogo width={125} />
                                            </View>
                                            <Text style={styles.mdmText}>
                                                MDM
                                            </Text>
                                        </Flex>
                                        {error && (
                                            <View style={styles.errorContainer}>
                                                <Feather
                                                    style={{
                                                        marginLeft: 25,
                                                        marginRight: 15,
                                                    }}
                                                    name="x-circle"
                                                    size={16}
                                                    color="grey"
                                                />
                                                <Text
                                                    style={styles.errorMessage}>
                                                    {error}
                                                </Text>
                                            </View>
                                        )}
                                        <Box
                                            marginTop="20px"
                                            pt="25px"
                                            px="25px">
                                            <Button
                                                titleStyle={{
                                                    fontWeight: '500',
                                                }}
                                                mr="0px"
                                                onPress={() =>
                                                    Auth.federatedSignIn({
                                                        // @ts-ignore
                                                        provider:
                                                            'customermmastermdmdev',
                                                    })
                                                }
                                                title="Sign In - MDM"
                                            />
                                        </Box>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Authenticator>
                </View>
            </View>
        );
    }
}

export default withOAuth(Login);

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        flexBasis: 'auto',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    logoContainer: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    insightLogo: {
        width: 170,
        height: 150,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9CFC7',
        paddingVertical: 15,
        marginHorizontal: 15,
        borderRadius: 5,
    },
    errorMessage: {
        color: '#333333',
        fontWeight: '500',
        fontSize: 16,
    },
    loginScreenContainer: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        flex: 1,
        flexBasis: 'auto',
        minWidth: 425,
        minHeight: 325,
        paddingHorizontal: 75,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    loginFormView: {
        flex: 1,
        flexBasis: 'auto',
    },
    loginFormTextInput: {
        height: 43,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eaeaea',
        backgroundColor: '#fafafa',
        paddingLeft: 10,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        marginBottom: 5,
    },
    loginButton: {
        backgroundColor: '#0756B8',
        borderRadius: 5,
        minHeight: 45,
        marginTop: 25,
        marginBottom: 25,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 124,
    },
    loginButtonTitle: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 18,
    },
    fbLoginButton: {
        height: 45,
        marginTop: 10,
        backgroundColor: 'transparent',
    },
    mdmText: {
        fontSize: 40,
        fontWeight: '400',
        paddingTop: 18,
        marginLeft: 5,
        color: Colors.lightBlue,
    },
});
