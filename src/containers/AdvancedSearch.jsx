import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Column, Flex, Card } from '../components/common';
import { Colors } from '../theme';
import FormInput from '../components/form/FormInput';

class Page extends React.Component {
    render() {
        const { width, height, marginBottom, location } = this.props;
        const { state } = location;
        const customer = state;

        return (
            <View
                style={{
                    backgroundColor: '#EFF3F6',
                    paddingTop: 50,
                    paddingBottom: 75,
                    height: '100vh',
                }}>
                <ScrollView
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 75 : width * 0.1,
                        paddingBottom: 5,
                    }}>
                    <Card>
                        <Text
                            style={{
                                fontWeight: '500',
                                fontSize: 32,
                                color: Colors.lightBlue,
                                marginBottom: 20,
                                paddingLeft: 45,
                            }}>
                            Advance Search
                        </Text>
                        <Flex>
                            <Column
                                padding="15px 45px 15px 55px"
                                style={{
                                    flex: 1,
                                    alignItems: 'flex-start',
                                }}>
                                <FormInput text="MDM Number" />
                                <FormInput text="Name" />
                                <FormInput text="Street" />
                                <FormInput text="City" />
                                <FormInput text="State" />
                                <FormInput text="Zip Code" />
                                <FormInput text="DUNS Number" />
                                <FormInput text="Tax ID/ VAT Reg No:" />
                            </Column>
                        </Flex>
                    </Card>
                    <Flex
                        justifyEnd
                        alignCenter
                        style={{
                            paddingTop: 65,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 10,
                            paddingRight: 15,
                            marginTop: 20,
                            marginBottom: 10,
                            marginHorizontal: 25,
                        }}>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 8,
                                paddingHorizontal: 25,
                                backgroundColor: '#12243F',
                                borderRadius: 2.5,
                                marginRight: 20,
                            }}
                            onPress={this.props.history.goBack}>
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    color: '#FFFFFF',
                                    fontFamily: 'Arial',
                                    paddingRight: 5,
                                }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                paddingVertical: 8,
                                paddingHorizontal: 25,
                                backgroundColor: '#12243F',
                                borderRadius: 2.5,
                            }}>
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    color: '#FFFFFF',
                                    fontFamily: 'Arial',
                                }}>
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </Flex>
                </ScrollView>
            </View>
        );
    }
}

class Default extends React.Component {
    render() {
        const props = this.props;

        return (
            <DimensionAware
                render={dimensions => (
                    <Page
                        {...{
                            ...props,
                            width: getWindowWidth(dimensions),
                            height: getWindowHeight(dimensions),
                            marginBottom: 25,
                        }}
                    />
                )}
            />
        );
    }
}

export default Default;
